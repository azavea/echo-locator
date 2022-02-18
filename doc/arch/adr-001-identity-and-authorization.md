# Identity and Authorization

## Context

_Describe the problem and provide any relevant background information._

ECHO's identity and authorization system suffers from two significant shortcomings:
1. Due to funding restrictions on the initial project, it was developed using an unfamiliar technical stack (AWS Amplify, Cognito, and Lambda) that turned out to be somewhat inflexible and difficult to administer.
2. The initial identity / authorization requirements of the application were unusual and somewhat complicated, because while Cognito uses emails as user identifiers, the application also required the ability to identify users via voucher numbers, and also allows counselors to view and edit all profiles. This made the identity and authorization handling code quite complex and error-prone. These requirements have since been dropped and the client desires to switch to a standard email-based identity system with voucher numbers tracked only as metadata.

_What do we need to decide?_

We've already decided to migrate the application backend to Django, for a variety of reasons, and had planned to migrate the identity and authorization parts of the app to Django as well. However, recent discussion with Civic Apps exposed that they've been very happy with their use of Auth0 with Django for some of their recent projects, so using Auth0 + Django seemed worth considering. Additionally, we need to plan how to migrate user data from the existing system to the new one.

_Which options exist?_

No matter which option we pick, it will impact the work we do in three distinct phases:

1. How we implement an identity / authorization system into the application using the new technology
2. How we migrate the existing users and their profile data to the new system
3. How users interact with the finished system and how we maintain the system long-term

Therefore, we need to consider how each of our options would impact these three phases of work.

The two primary options we are considering are:

1. Using Django alone as an authentication provider
2. Using Auth0 as an identity provider and integrating it with Django's authorization system

_Evaluate each option_

### Django alone

#### Implementation

We would need to implement a database model or models to store users and their profile data. We would need to create API endpoints for signing up, email verification, logging in, logging out, changing passwords, resetting passwords, and updating the user's profile. We would need to add integration with an email service such as SES in order to support email verification and password reset flows and create appropriate email templates.

We would also need to replace the existing frontend components and logic (currently written in customized Amplify React components) with custom React components or Django templates. These components/templates would need to support internationalization similarly to the rest of the application.

#### Migration

We would need to create a new user account in Django for each Cognito user. We would need to copy the profile data for each user from S3 and associate it with the appropriate Django user account. This would most likely be accomplished by some type of script that could run as a management command. Once the application is deployed, we would need to email all users instructing them to reset their password. Issues requiring manual intervention could be addressed by using the Django admin.

#### User interaction and maintenance

Users would most likely experience some visual changes to the login screen and different email messages. Administrators would have to learn a new administration system, but the Django admin offers many more features than the Cognito console, so this would be an improvement.

It's not expected that there would be additional maintenance beyond the usual required to operate a Django instance (i.e. periodic Django and Python package updates along with Postgresql updates).

### Django + Auth0

#### Implementation

We would need to set up an Auth0 account for the project. We would need to implement a database model or models to store users and their profile data (in this setup we are envisioning using Auth0 as an identity provider only, so Auth0 handles authentication, but does not store any profile information--instead, it sends a unique user ID to the Django app whenever a user logs in, and Django is responsible for associating the user's profile information with that user ID. Auth0 _can_ also store profile information, but it's just stored as a JSON blob--within a Django ecosystem it'll be easiest to simply use a Django model).

We would need to create "callback" (login) and logout endpoints and [integrate Django with Auth0](https://auth0.com/docs/quickstart/webapp/django/01-login), but user creation, email verification, and password resets would be handled by Auth0. Initially, we would not need to integrate with an email sending service, but [using your own email service is necessary if you want to customize the email templates](https://auth0.com/docs/customize/email/email-templates).

It's unclear how much Auth0 configuration needs to be done via click-ops; there is a [Terraform Auth0 provider](https://registry.terraform.io/providers/alexkappa/auth0/latest/docs) but I'm not sure how robust it is (though it does seem to be actively maintained).

As a side note, `woonerf` (the utility library that Conveyal used when building the application) [includes functionality for integrating with Auth0](https://github.com/conveyal/woonerf#auth0). However, `woonerf` has not been actively maintained for 3-4 years, and Conveyal does not seem to be using it in new applications, so we should consider it deprecated and build Auth0 support on our own.

#### Migration

Auth0 has the capability to do a bulk import of user records following a predefined JSON schema. We would need to write a script to download user account information from the Cognito API, transform it into the appropriate schema, and then upload it to Auth0 (or we could do the upload manually). However, this would only import user accounts, not their profile information.

I wasn't able to find much information about doing bulk imports of user accounts and also migrating their profile information to a new system, but I think what we'd have to do is to create a second script to import the user profile information to Django and set up logic to link the profile info to the user accounts using a common identifier (the email address, probably).

Auth0 has the capability to support multiple different password hashing schemes, so if you have access to the hashed password, you can import the account without having to require a password reset. But Cognito doesn't provide password hashes as far as I can tell (and I'd be surprised if it did), so we'll still have to require a password reset (and come to think of it, this applies to the Django app as well, since you can also configure how Django handles password hashing).

#### User interaction and maintenance

By default, when users enter the Auth0 authentication flow, they're directed to an Auth0 interface and domain name, e.g. bha-echo.auth0.com. It is possible to customize both the Auth0 template and the domain name, but [customizing the template requires customizing the domain](https://auth0.com/docs/customize/universal-login-pages/universal-login-page-templates) and [customizing the domain requires a paid account](https://auth0.com/docs/customize/custom-domains), which costs $23/month (though there is a non-profit discount that BHA should be eligible for which seems to reduce the cost by 50%).

Most administrative tasks could still be done via the Django admin because the profile information would be there, but things like manual password resets would need to be done via the Auth0 console instead, which could introduce confusion for administrators.

By integrating with an outside service we open ourselves up to needing to respond to changes in that services API, and there is also the risk that login could become impossible for a time if Auth0 goes down.

Auth0 supports all major languages that we currently support in the app, and in general, has [a pretty extensive list of supported languages](https://auth0.com/docs/customize/internationalization-and-localization/universal-login-internationalization). However, if Boston has any immigrant enclaves that use less prominent languages that they want to add translations for, we might be out of luck.

_Include the pros and cons of each option._

### Django alone

Pros:
- Would follow an established pattern of Azavea applications stretching back many years.
- Migration is relatively straightforward because accounts and profile data are all in the same place.
- Essentially infinitely customizable (given sufficient budget)

Cons:
- Significant work to create full login / logout system from scratch, including integration with email service and frontend pages or components for users
- Customization can be expensive in comparison to pushbutton solutions


### Django + Auth0

Pros:
- In the ideal case, would cut down significantly on the work required to create the authentication system because we'd just need to implement the login/logout endpoints and Auth0 would handle the interface and emails.
- Pushbutton support for other types of authentication like MFA and social logins (currently we haven't had requests to use either of those things, but it could happen in the future).

Cons:
- If we want to customize the domain or design of the login form then we'll need to pay, and we'll also need to integrate with an email provider.
- Would split administrative tasks across two consoles depending on the task, which could be confusing for administrators.
- Seems like it makes user imports somewhat more complex (in that we'd need two separate scripts and would have to make sure that everything linked up correctly)


## Decision

_What have we decided to do?_

We have a (relatively) healthy budget and timeframe for completing this work, and part of the justification for undertaking the switch to Django was customizability and ease of administration. Given that, it probably makes the most sense to pursue a Django-only solution so that everything stays in one place and is as customizable as possible (even if that customization costs more in the long run).

## Consequences

- Customizations to the login pages will be relatively straightforward.
- Customizations to the authentication process (e.g. adding social logins or MFA) will be somewhat more complex (but we expect Django's large ecosystem to help here: at least for authentication using social auth providers, there are mature libraries that make it relatively easy to implement).
- We need to come up with a deployment plan that accounts for the provider we've chosen. Which is included below.

## Deployment / Migration Plan

1. Begin development on Django API within staging environment. We could either place the Django app at a subdomain (e.g. api.staging.echolocator.org) or path of the existing site (e.g. staging.echolocator.org/api). We've done both in the past but in this case I'm leaning toward a path because that would avoid cross-origin issues and give us access to Django templates if we want them. It would also put the Django admin in a logical place (staging.echolocator.org/admin as opposed to api.staging.echolocator.org/admin, which seems more confusing). This will include setting up CI deployment to staging as well. Note that we should switch away from using `woonerf` for API access because it appears unmaintained and because [its `fetch` function gave us some struggles](https://github.com/azavea/echo-locator/pull/374) previously. We could add in a library like axios as a replacement, or use plain old browser `fetch()`.
2. Rework staging signup and authentication flow to target the staging Django server. This may cause login to the staging site to become unusable via normal means for a period of time, so we should make sure to keep anonymous authentication available so that BHA can continue to use the site for demo purposes if they need to.
3. Write user migration scripts.
4. Thoroughly test user migration scripts against staging. In this case "migration" is actually just copying, so we can do this non-destructively as many times as we want to be certain that everything works as expected. We should also test migrating the production user database into staging, as that has more users and is more likely to encounter edge cases.
5. Create an admin-configurable flag to prevent user login or signup temporarily. The primary risk during this deployment process will be data loss if a user changes their data between when we start the migrating and when we finish it, so we should prevent users from logging in while the migration is in process.
6. Develop and test a method to tell all users to reset their password. This could be accomplished via a script and whatever email service we choose to use, or through BHA infrastructure if they have something like MailChimp.

Once the above are all complete, the deployment plan should look something like this:
1. Coordinate with BHA on a deployment window
2. Queue up "reset your password" email blast
3. At start of window, deploy to production with login/signup flag set to false.
4. Run user migration scripts
5. Switch login/signup flag to true
6. Send "reset your password" email blast
7. Celebrate!

The primary risk to this strategy is that the migration script fails during production deployment somehow and the deploy takes longer than expected or we have to roll back, which would cause additional downtime. However, the very different natures of the two authentication systems (both in terms of technology and expected functionality) means that doing a zero-downtime migration would add significant extra complexity, and because site usage is relatively low, a deploy that takes somewhat longer than expected should not be a major inconvenience.
