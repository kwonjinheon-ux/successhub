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
Updated signup to require name, email verification code, password, and password confirmation. Password rules are checked live: minimum 8 characters with lowercase, uppercase, number, and special character.

## Modified files
- `src/components/auth/AuthPanel.tsx`
- `src/app/api/auth/email-code/route.ts`
- `src/app/api/auth/email-code/verify/route.ts`
- `src/services/firebaseAdmin.ts`
- `src/styles/globals.css`
- `database.rules.json`
- `.env.example`
- `apphosting.yaml`

## Firebase configuration
Email verification codes are stored server-side in Firebase Realtime Database under `emailVerificationCodes`. Client access is denied by rules; only server-side Firebase Admin access should write and verify codes.

## Test method
Run `npm install` and `npm run build`. In production, configure SMTP variables before testing email delivery.

## Test result
`npm install` completed and `npm run build` passed. The new email-code API routes are built as dynamic server routes.

## Remaining issues
SMTP secrets must be configured in App Hosting before real email code delivery works in production.
