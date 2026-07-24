# 07-2026 Text message authentication

## Context

The application currently supports passwordless authentication using email magic links only.

- A user enters an email address.
- The backend creates an account if needed and sends a login link.
- The user clicks the link and is authenticated.

This same flow is used for both sign-in and account creation.

Most users access ECHO on mobile devices. For this population, switching from the app to email and back is cumbersome. Feedback indicates users would benefit from phone-based authentication because mobile operating systems commonly surface one-time verification codes directly in the keypad flow.

We need to support account creation and sign-in with either email or phone number while maintaining a secure, low-friction UX.

### Requirements and Constraints

- Keep support for email-based passwordless authentication if practical.
- Add support for phone-based authentication using a verification code.
- Use this for both sign-in and sign-up.
- Phone numbers can be US-only for now.
- Admin users must be able to search and manage users by phone number.
- Prevent silent duplicate account creation when a user signs in with a different identifier than they used previously.
- Minimize implementation risk and delivery time.

## Decision

We will implement a multi-channel passwordless authentication system with:

1. Email magic links retained for email authentication.
2. SMS one-time passcodes (OTP) added for phone authentication.
3. A contact-method-based identity model, rather than overloading the Django username field.
4. US-only phone support in the initial release.
5. Admin tools for phone-based search and support workflows.
6. An explicit account recovery and contact-linking flow to handle "I signed up with a different method" scenarios.

For the initial SMS provider, we will use Twilio Verify behind a thin provider abstraction.

This provides the fastest path to production with lower implementation risk for OTP lifecycle management (expiry, resend, attempt limits, and delivery concerns), while preserving optionality for a future provider change.

## Options Considered

### Option 1: Replace magic links with one-time codes for both email and phone

Pros:

- Unified user experience across channels.
- Shared verification flow across providers.

Cons:

- Requires reworking the existing email flow.
- Larger migration and UX change than needed.
- Higher risk and effort for an initial release.

### Option 2: Keep email magic links, add phone OTP, model identity by contact methods (chosen)

Pros:

- Solves mobile pain while preserving proven email flow.
- Supports either email or phone for sign-in and sign-up.
- Clean data model for future expansion (multiple methods per account).
- Allows phased rollout with lower regression risk.

Cons:

- More complex than channel-specific quick fixes.
- Requires new domain models, admin updates, and anti-abuse controls.

## Rationale

Option 2 provides the best balance of speed, maintainability, and user impact.

- It directly addresses the mobile UX issue by adding phone OTP.
- It avoids unnecessary churn in the current email magic-link path.
- It avoids long-term technical debt from treating `username` as a mixed email-or-phone identifier.
- It supports expected future requirements, such as users having both email and phone on one account.
- It reduces account fragmentation risk by defining account recovery and method-linking behavior up front.

Twilio Verify is selected initially because it minimizes custom OTP lifecycle logic and shortens time to release, while the provider abstraction keeps vendor lock-in manageable.

## Consequences

### Positive

- Mobile users get a faster sign-in/signup experience via SMS code autofill behavior.
- Email users retain familiar login behavior.
- Admin workflows improve with phone lookup capability.
- Architecture supports future channel expansion and account linking.
- Lower risk of users landing in newly created empty accounts when they forget which method they used previously.

### Negative / Costs

- New dependencies and operational setup for SMS provider credentials and delivery monitoring.
- Additional backend complexity for contact method ownership, verification states, and merge/link rules.
- Additional UI states and localization strings.

### Security and Abuse Controls

Implementation must include:

- Rate limits for challenge creation, resend, and verify attempts.
- Per-identifier and per-IP throttling.
- Short OTP expiry window.
- Attempt counters and lockout behavior.
- Generic user-facing success/error messages to prevent account enumeration.
- Auditable logging without storing sensitive OTP values.

## Technical Direction

### Data Model

Introduce first-class contact identity records associated with a user account, including:

- `type`: email or phone
- `value_normalized`: lowercase email or E.164 phone
- `is_verified`
- `is_primary`
- timestamps and metadata needed for support/debugging

Introduce authentication challenge records for OTP verification tracking (or equivalent provider mapping fields), including:

- challenge purpose (login/signup)
- state and expiration
- attempt counters and resend metadata
- provider correlation IDs where relevant

### API and Flow

Use a channel-aware authentication flow:

1. User submits identifier (email or phone).
2. Backend normalizes identifier and checks for an existing contact method match.
3. Email channel sends magic link.
4. Phone channel sends OTP and verifies OTP.
5. On success, backend issues existing API token.

### Account Resolution and Recovery

To avoid duplicate accounts and data loss confusion:

- If submitted identifier matches an existing contact method, authenticate that existing account.
- If identifier does not match an existing contact method, create a new account only after successful challenge verification for that identifier.
- Add a user-facing recovery path (for example, "Used a different sign-in method?") that allows users to verify a second contact method and attach it to their existing account when unclaimed.
- If the second contact method is already attached to a different account, block automatic linking and route to admin support workflow.
- After successful authentication, prompt users to add and verify a backup method to reduce future lockout/duplication risk.

## Estimated Effort

Expected implementation range: 3 to 6 weeks, depending on depth of hardening and rollout safeguards.

- Lower bound: focused MVP with required controls and tests.
- Upper bound: fuller hardening, richer admin tooling, and phased rollout instrumentation.
