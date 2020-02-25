/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authEcholocatorProdAuthUserPoolId = process.env.AUTH_ECHOLOCATORPRODAUTH_USERPOOLID
var storageEcholocatorProdStorageBucketName = process.env.STORAGE_ECHOLOCATORPRODSTORAGE_BUCKETNAME

Amplify Params - DO NOT EDIT */

var AWS = require('aws-sdk')
var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var validateUuid = require('uuid-validate')

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", true)
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

app.post('/profiles', function(req, res) {
  var region = process.env.REGION;
  AWS.config.update({region: region});
  var s3 = new AWS.S3();
  var cognito = new AWS.CognitoIdentityServiceProvider();

  var identityId = req.body.identityId;
  var email = req.body.email;
  if (!identityId) {
    res.json({error: 'Missing Cognito user identityId in POST body'});
    return;
  } else {
    // sanity-check identity ID looks like [AWS region]:[UUID]
    var idParts = identityId.split(':')
    if (!idParts || idParts.length !== 2 ||
      idParts[0] !== region || !validateUuid(idParts[1])) {

      console.error('Cognito identity ID sent does not match expected format');
      res.json({error: 'Cognito identity ID does not match expected format', identityId});
      return;
    }
  }
  if (!email) {
    res.json({error: 'Missing user email in POST body'});
    return;
  }

  // get Cognito user pool ID from CloudFront env parameters
  var userPool = process.env.AUTH_ECHOLOCATORPRODAUTH_USERPOOLID;
  var bucketName = process.env.STORAGE_ECHOLOCATORPRODSTORAGE_BUCKETNAME;

  cognito.adminGetUser({
    UserPoolId: userPool,
    Username: email
  }, function(getUserError, userData) {
    if (getUserError && getUserError.code === 'UserNotFoundException') {
      console.error('User with email ' + email + 'does not exist');
      res.json({error: 'User does not exist', email: email});
      return;
    } else if (getUserError) {
      console.error('Failed to get user');
      console.error(getUserError);
      res.json({error: err});
      return;
    } else {
      // get voucher number from user data
      if (!userData || !userData.UserAttributes || userData.UserAttributes.length === 0) {
        // Shouldn't happen, but check anyways
        console.error('Returned user data is missing attributes');
        console.error(userData);
        res.json({error: 'Returned user data is missing attributes'});
        return;
      }

      // Look through the name/value pairs for the voucher number
      var voucherAttr = userData.UserAttributes.find(function(attr) {
        return attr.Name === 'custom:voucher';
      });
      var voucher = voucherAttr.Value;
      if (!voucher) {
        console.error('Failed to find voucher number for user account');
        res.json({error: 'User has no voucher number in Cognito', email});
        return;
      }

      var key = null;
      s3.listObjectsV2({
        Bucket: bucketName,
        Prefix: 'public/' + voucher
      }, function (listError, listData) {
        if (listError) {
          console.error('S3 query failed');
          console.error(listError);
          res.json({error: listError});
          return;
        }
        if (listData && listData.KeyCount > 0) {
          if (listData.KeyCount > 1) {
            // check for an exact match
            var exactMatches = listData.Contents.filter(function(result) {
              // strip prefix
              var resultKey = result.Key.substring('public/'.length);
              // strip user ID suffix, if any, before comparing key to voucher number
              if (resultKey.indexOf('_') > -1) {
                resultKey = resultKey.split('_')[0];
              }
              return resultKey === voucher;
            });
            if (exactMatches && exactMatches.length > 1) {
              // Shouldn't happen, but might. This situation should be resolved manually.
              res.json({error: 'Multiple profiles matching voucher number already exist',
                       voucher});
              return;
            } else if (exactMatches && exactMatches.length === 1) {
              // Found one exact match, as expected
              key = exactMatches[0].Key;
            } else {
              // Found no exact matches
              res.json({error: 'No profiles found on S3 for voucher', voucher});
              return;
            }
          } else {
            key = listData.Contents[0].Key; // exists if KeyCount is nonzero
          }
        } else {
          // no results
          res.json({error: 'No profiles found on S3 for voucher', voucher});
          return;
        }
        if (key) {
          // Verify file to copy is for an email that matches this Cognito account.
          // If not, delete this Cognito account.
          s3.getObject({
            Bucket: bucketName,
            Key: key
          }, function(downloadError, downloadResult) {
            if (downloadError) {
              console.error('S3 download failed');
              res.json({error: downloadError});
              return;
            }
            var fileContents = downloadResult.Body.toString();
            var json = JSON.parse(fileContents);
            if (json.clientEmail && json.clientEmail !== email) {
              console.warn('Profile exists, but for another email. Deleting Cognito account for ' +
                email);
              // Delete Cognito account
              cognito.adminDeleteUser({
                UserPoolId: userPool,
                Username: email
              }, function(deleteUserError, deleteUserResult) {
                if (deleteUserError) {
                  res.json({error: 'Error deleting Cognito account ' + email +
                    ': ' + deleteUserError});
                  return;
                }
                res.json({error: 'Profile exists for another email. Deleted account for ' + email});
                return;
              });
            }
            console.log('Copy S3 file at ' + key + ' for identity ' + identityId);
            var newS3Key = 'public/' + voucher + '_' + identityId;
            if (newS3Key === key) {
              console.error('Cannot copy a file to itself');
              res.json({error: 'Profile already exists', key: key});
              return;
            }
            s3.copyObject({
              Bucket: bucketName,
              CopySource: bucketName + '/' + key,
              Key: newS3Key
            }, function(copyError, copyResult) {
              if (copyError) {
                console.error('S3 file copy failed');
                console.error(copyError);
                res.json({error: copyError});
              } else {
                s3.deleteObject({
                  Bucket: bucketName,
                  Key: key
                }, function (deleteError, deleteResult) {
                  if (deleteError) {
                    console.error('Failed to delete original S3 file after copying it');
                    console.error(deleteError);
                    res.json({error: deleteError});
                  } else {
                    res.json({key: newS3Key})
                  }
                });
              }
            });
          });
        } else {
          // Shouldn't get here
          console.error('Failed to find exact match for voucher, but found results', voucher);
          res.json({error: 'No profiles found on S3 for voucher', voucher});
        }
      });
    }
  });
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
