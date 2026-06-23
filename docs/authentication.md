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
