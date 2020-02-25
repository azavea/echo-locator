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
var authEcholocatorStagingAuthUserPoolId = process.env.AUTH_ECHOLOCATORSTAGINGAUTH_USERPOOLID

Amplify Params - DO NOT EDIT */

var AWS = require('aws-sdk')
var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

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

app.post('/clients', function(req, res) {
  AWS.config.update({region: process.env.REGION});
  var cognito = new AWS.CognitoIdentityServiceProvider();

  var email = req.body.email;
  var voucher = req.body.voucher;
  if (!email) {
    res.json({error: 'Missing user email in POST body'});
    return;
  }
  if (!voucher) {
    res.json({error: 'Missing user voucher in POST body'});
    return;
  }
  // get Cognito user pool ID from CloudFront env parameters
  var userPool = process.env.AUTH_ECHOLOCATORSTAGINGAUTH_USERPOOLID;
  var params = {
    UserPoolId: userPool,
    Username: email
  };
  cognito.adminGetUser(params, function(getErr, userData) {
    if (getErr && getErr.code === 'UserNotFoundException') {
      params['UserAttributes'] = [{
        Name: 'custom:voucher',
        Value: voucher
      }, {
        Name: 'email',
        Value: email
      }, {
        Name: 'email_verified',
        Value: 'true'
      }];
      cognito.adminCreateUser(params, function(createErr, createData) {
        if (createErr) {
          console.log('Error creating user', createErr);
        } else {
          res.json({user: createData, url: req.url});
        }
      });
    } else if (getErr) {
      res.json({error: getErr});
    } else {
      // User already exists; resend the invite if user is not already confirmed
      if (userData.UserStatus === 'CONFIRMED') {
        res.json({error: 'User ' + email + ' already exists',
                  user: userData,
                  result: 'userExists'
                });
      } else {
        // The way to resend a user invite is not to use `ResendConfirmationCode`, but
        // to call to create the user again with the message action set to `RESEND`.

        // Only resend invite if the profile voucher number sent matches the Cognito account.
        // Look through the name/value pairs for the voucher number
        var voucherAttr = userData.UserAttributes.find(function(attr) {
          return attr.Name === 'custom:voucher';
        });
        var emailVoucher = voucherAttr.Value;
        if (emailVoucher === voucher) {
          params.MessageAction = 'RESEND';
          cognito.adminCreateUser(params, function(resendErr, resendData) {
            if (resendErr) {
              res.json({error: 'Failed to resend user invite',
                        user: userData,
                        errorObj: resendErr,
                        result: 'inviteResendFailed'})
            } else {
              res.json({user: resendData, result: 'resendingInvite'});
            }
          });
        } else {
          // Not resending user invite because voucher numbers do not match
          res.json({error: 'Not resending user invitation because voucher numbers do not match',
                    user: userData,
                    result: 'inviteNotResentVoucherMismatch'})
        }
      }
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
