# Firebase Authentication

## Work date
2026-06-23

## Work content
Added Firebase Authentication service functions and UI for email/password, Google, Facebook, and Apple sign-in. Phone login has a service boundary prepared through Firebase phone authentication.

## Modified files
- `src/services/authService.ts`
- `src/viewmodels/AuthViewModel.ts`
- `src/hooks/useAuth.ts`
- `src/components/auth/AuthPanel.tsx`
- `src/app/login/page.tsx`
- `src/app/signup/page.tsx`

## Firebase configuration
Email/password and Google providers are represented in `firebase.json`. Facebook, Apple, and phone providers still require Firebase console provider setup before production use.

## Test method
Use the deployed Firebase URL, open `/signup` and `/login`, create a user, sign in, sign out, and confirm the user appears in Firebase Authentication.

## Test result
`npm run build` passed on 2026-06-23. Remote authentication testing was not run because provider settings and web app env values are not confirmed.

## Remaining issues
Facebook and Apple OAuth credentials need provider configuration. Phone login needs Recaptcha UI wiring on the target screen.

## Next work
Add email verification and password reset flows after the first Firebase-backed login works.

---

## Work date
2026-06-23

## Work content
Updated signup to use Firebase Authentication's built-in email address verification link instead of a custom code email flow. Signup still requires name, email, password, and password confirmation. Password rules are checked live: minimum 8 characters with lowercase, uppercase, number, and special character.

## Modified files
- `src/components/auth/AuthPanel.tsx`
- `src/services/firebaseAdmin.ts`
- `src/styles/globals.css`
- `database.rules.json`
- `.env.example`
- `apphosting.yaml`

## Firebase configuration
Firebase Authentication sends the verification email from the configured Firebase email template. The deployed App Hosting domain must be authorized in Firebase Authentication settings.

## Test method
Run `npm install` and `npm run build`. In production, create an account and verify that Firebase sends the email verification link.

## Test result
`npm install` completed and `npm run build` passed.

## Remaining issues
Firebase Authentication email templates should use the desired sender name, reply address, subject, and action URL in the Firebase Console.

---

## Work date
2026-06-23

## Work content
Reduced Firebase `auth/too-many-requests` risk by preventing duplicate signup submissions, adding a resend cooldown, and removing automatic verification-email resend on every unverified login attempt.

## Modified files
- `src/components/auth/AuthPanel.tsx`
- `src/services/authService.ts`
- `src/services/firebaseClient.ts`
- `src/viewmodels/AuthViewModel.ts`

## Firebase configuration
Firebase may still temporarily block requests after repeated signup or email verification attempts. This is a Firebase Auth abuse-protection limit and clears after waiting.

## Test method
Run `npm run build` and test signup after the Firebase cooldown clears.

## Test result
`npm run build` passed.

## Remaining issues
If Firebase has already rate-limited the current IP/email, wait several minutes before retrying.

---

## Work date
2026-06-23

## Work content
Changed Firebase email verification to use Firebase Authentication's default action URL instead of passing the App Hosting `/login` URL. This avoids verification email delivery failures when the hosted domain is not authorized as a continue URL.

## Modified files
- `src/services/authService.ts`
- `src/services/firebaseClient.ts`

## Firebase configuration
Firebase Authentication email template settings are used for sender, subject, and action link. The template currently sends from `noreply@success-hub-2026.firebaseapp.com`.

## Test method
Run `npm run build`, then create a new test account after any Firebase rate-limit cooldown clears.

## Test result
`npm run build` passed.
