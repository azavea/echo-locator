## About this Amplify stack

This stack was mostly generated using the Amplify CLI. Some modifications were made to add a custom Cognito property, refine S3 access permissions, and to add code for two `nodejs` functions (Lambdas). Those modifications are described below. Note that the Amplify CLI may overwrite CloudFormation template modifications during some operations.


### ECHO Amplify CloudFormation modifications:

 - add custom voucher property to auth configuration:
    - under template `Schema`:
        -
          Name: voucher
          Required: false
          Mutable: false
          AttributeDataType: String
          StringAttributeConstraints:
            MinLength: "6"
            MaxLength: "8"
    - in parameters.json, add `custom:voucher` to `userpoolClientWriteAttributes` and `userpoolClientReadAttributes`
 - set S3 parameters.json (`AuthenticatedAllowList`) to `DISALLOW` to deny client bucket listing
 - remove list bucket from `selectedAuthenticatedPermissions` in S3 parameters.json
 - remove all permissions from `selectedGuestPermissions` in S3 parameters.json
 - set `S3AuthPublicPolicy` resource to "/public/*_${cognito-identity.amazonaws.com:sub}"
 - add code to functions for /clients and /profiles, and add `aws-sdk` to `package.json` for both
 - also updated the versions for all auto-installed packages (not strictly necessary)
 - add `uuid-validate` to `package.json` for the profiles function
 - profile function needs S3 CloudFormation access modified for `ListBucket` as for the `counselorsGroupPolicy` below
 - modify `counselorsGroupPolicy` policy `Statement` to grant `public/` list permissions separately:

```
 "Statement": [
    {
        "Effect": "Allow",
        "Action": [
            "s3:PutObject",
            "s3:GetObject",
            "s3:DeleteObject"
        ],
        "Resource": [
            {
                "Fn::Join": [
                    "",
                    [
                        "arn:aws:s3:::",
                        {
                            "Ref": "S3Bucket"
                        },
                        "/*"
                    ]
                ]
            }
        ]
    },
    {
        "Effect": "Allow",
        "Action": [
            "s3:ListBucket"
        ],
        "Resource": [
            {
                "Fn::Join": [
                    "",
                    [
                        "arn:aws:s3:::",
                        {
                            "Ref": "S3Bucket"
                        }
                    ]
                ]
            }
        ],
        "Condition": {
            "StringLike": {
                "s3:prefix": [
                    "public/",
                    "public/*"
                ]
            }
        }
    }
]
```