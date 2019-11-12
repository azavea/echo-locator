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
var authEcholocatorDevEmailAuthUserPoolId = process.env.AUTH_ECHOLOCATORDEVEMAILAUTH_USERPOOLID
var storageEcholocatorDevEmailStorageBucketName = process.env.STORAGE_ECHOLOCATORDEVEMAILSTORAGE_BUCKETNAME

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


/**********************
 * Example get method *
 **********************/

app.get('/profiles', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

app.get('/profiles/*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

/****************************
* Example post method *
****************************/

app.post('/profiles', function(req, res) {
  AWS.config.update({region: 'us-east-1'});
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
      idParts[0] !== 'us-east-1' || !validateUuid(idParts[1])) {

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
  var userPool = process.env.AUTH_ECHOLOCATORDEVEMAILAUTH_USERPOOLID;
  var bucketName = process.env.STORAGE_ECHOLOCATORDEVEMAILSTORAGE_BUCKETNAME;
  console.log('Bucket name: ' + bucketName);

  cognito.adminGetUser({
    UserPoolId: userPool,
    Username: email
  }, function(getUserError, userData) {
    if (getUserError && getUserError.code === 'UserNotFoundException') {
      console.error('User with email ' + email + 'does not exist');
      res.json({error: 'User does not exist', email: email});
    } else if (getUserError) {
      console.error('Failed to get user');
      console.error(getUserError);
      res.json({error: err});
    } else {
      console.log('Found user');
      console.log(userData);

      // get voucher number from user data
      if (!userData || !userData.UserAttributes || userData.UserAttributes.length === 0) {
        // Shouldn't happen, but check anyways
        console.error('Returned user data is missing attributes');
        console.error(userData);
        res.json({error: 'Returned user data is missing attributes'});
        return;
      }

      // Look through the name/value pairs for the voucher number
      var voucher = null;
      for (var i = 0; i < userData.UserAttributes.length; i++) {
        var attr = userData.UserAttributes[i];
        if (attr.Name === 'custom:voucher') {
          voucher = attr.Value;
          break;
        }
      }

      if (!voucher) {
        console.error('Failed to find voucher number for user account');
        res.json({error: 'User has no voucher number in Cognito', email});
        return;
      }

      s3.listObjectsV2({
        Bucket: bucketName,
        Prefix: 'public/' + voucher
      }, function (listError, listData) {
        if (listError) {
          console.error('S3 query failed');
          console.error(listError);
          res.json({error: listError});
        } else {
          console.log('S3 query succeeded', listData);
          if (listData && listData.KeyCount > 0) {
            if (listData.KeyCount > 1) {
              // FIXME: Shouldn't happen, but might. How should this situation be resolved?
              res.json({error: 'Multiple profiles matching voucher number already exist',
                        voucher});
            } else {
              var key = listData.Contents[0].Key; // exists if KeyCount is nonzero
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
                  console.log('File copy succeeded. Delete the original.');
                  s3.deleteObject({
                    Bucket: bucketName,
                    Key: key
                  }, function (deleteError, deleteResult) {
                    if (deleteError) {
                      console.error('Failed to delete original S3 file after copying it');
                      console.error(deleteError);
                      res.json({error: deleteError});
                    } else {
                      console.log('Successfully deleted original S3 file aftery copying it');
                      res.json({key: newS3Key})
                    }
                  });
                }
              });
            }
          } else {
            // no results
            console.log('No results found on S3 for voucher ' + voucher);
            res.json({error: 'No profiles found on S3 for voucher', voucher});
          }
        }
      });
    }
  });
});

app.post('/profiles/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

/****************************
* Example put method *
****************************/

app.put('/profiles', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/profiles/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/profiles', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/profiles/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
