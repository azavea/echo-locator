# User preferences storage

## Context

This project requires storing a small amount of user data across sessions, in order to retain the user's form input and their favorite/liked neighborhoods. The project will be a static React site based on [taui](https://github.com/conveyal/taui) without need for a server component otherwise (except for directions/routing results, which project partner Conveyal will provide).

The project has two kinds of users:

1. Counselors, who need to be able to access and modify any voucher holder's stored preferences, and
2. Voucher holders, who should be able to access and modify only their own stored preferences

Options for access management to stored preferences considered here:

1. [Auth0](#auth0) accounts with custom user metadata properties
2. [Cognito](#cognito) accounts with S3 files
3. [No authentication](#no-authentication) with S3 files



### Auth0

[Auth0](https://auth0.com) provides user authentication, authorization, and account management as a service. They offer unlimited free service to open-source, non-profit projects via their [Open Source Program](https://auth0.com/pricing). Their documentation includes [React samples](https://auth0.com/docs/quickstart/spa/react).

The site preferences could be stored directly with the user via the [user metadata](https://auth0.com/docs/users/concepts/overview-user-metadata). (Cognito also supports custom user metadata.) If the user preferences are stored externally instead, however, accessing the resource with Auth0 would require using their now deprecated [delegation](https://auth0.com/docs/api-auth/intro#delegation) feature that may become unsupported at any time, requiring the project to switch to a different service or API feature.

It is unclear how counselor access would be managed to the voucher holder accounts if the user preferences are stored as user metadata. Either the counselor would have to log in as the voucher holder, instead of having separate counselor accounts, or Auth0 access management would need to be modified somehow to allow counselor accounts to access and modify other accounts' metadata. Either option would involve defeating valuable aspects of account management and would likely prove difficult to implement. Further, the [Management API](https://auth0.com/docs/api/management/v2) for writing user metadata is not suitable for use in single page apps.


### Cognito

Similar to Auth0, [Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html) is the authentication, authorization, and user account management service provided by AWS. The service is free [up to 50,000 monthly active users](https://aws.amazon.com/cognito/pricing/), which should be plenty to cover this project; BHA has 12,000 ECHO vouchers, and serves 22,500 total, including other programs, according to [this](https://www.bostonhousing.org/en/For-Section-8-Leased-Housing/Voucher-Programs/Expanding-Choice-in-Housing-Opportunities-\(ECHO\).aspx).

AWS has integrated Cognito with S3 bucket access controls, as described [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_s3_cognito-bucket.html). Also, there is a JavaScript library, [aws-amplify](https://github.com/aws-amplify/amplify-js), we could use for front-end integration. The library has Cognito authentication support and also a storage component that supports and defaults to using S3. The library appears to be popular and currently maintained. It supports both other authentication frameworks and storage backends, so should the project have need to switch either, it may be possible to do so with minimal code changes.


### No authentication

The client-provided wireframes only show the user entering the voucher holder name and voucher number. If the voucher number is treated like a password, it could be used to access, for example, an S3 file of the user preferences that uses the voucher number as part of the path or file name.

This approach would be the simplest, but would not protect the user preferences from access by other parties who might have the name and voucher number. Access could be restricted by IP address to only allow users in the counseling office; however, this would prevent use of the app directly by the clients, outside of the office.

A potential benefit of not having user accounts is that there would be no need to distinguish between counselor accounts, which need to be able to access any voucher holder's stored preferences, and user accounts, which should have access restricted to only their own stored preferences. Potential downsides, in addition to the lack of access control, would include the inability to audit access, or to track access by user for purposes of gathering analytic data.


## Decision

We will use AWS Cognito for authentication to control access to user preference files stored on S3. This approach will protect user data, enable counselor access, and best support future expansion of the project by establishing the means for data access control and auditing as well as the potential for user analytics. Also, as we were already planning to use AWS products for other aspects of this project, using AWS for authentication as well should simplify our stack and ease integration of user management.


## Consequences

The consequences of this decision will be:

 - User account management must be set up, adding complexity
 - User data access will be protected
 - Potential additional hosting costs should use exceed 50,000 MAU
 