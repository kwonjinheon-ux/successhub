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
