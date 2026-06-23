# Work Log

## Work date
2026-06-23

## Work content
Initialized Success Hub 2026 as a Firebase-based Next.js project skeleton using MVVM-oriented folders and services.

## Modified files
- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `.env.example`
- `firebase.json`
- `apphosting.yaml`
- `database.rules.json`
- `storage.rules`
- `src/app/*`
- `src/components/*`
- `src/hooks/*`
- `src/models/*`
- `src/services/*`
- `src/viewmodels/*`
- `src/styles/globals.css`
- `docs/*`

## Firebase configuration
Configured client SDK entry points for Authentication, Realtime Database, and Storage. Added Admin SDK initialization for server-side user management once service account secrets are supplied.

## Test method
Run dependency installation and build verification, then deploy rules and App Hosting after Firebase project confirmation.

## Test result
Dependency installation completed and `npm run build` passed on 2026-06-23. Git status could not be checked from the sandbox user because the parent repository requires a `safe.directory` exception.

## Remaining issues
Need confirmed Web App config values, Firebase login/project selection, and provider enablement.

## Next work
Install dependencies, run build, fix any type errors, then deploy rules and App Hosting when Firebase access is available.

---

## Work date
2026-06-23

## Work content
Removed a publicly exposed Google/Firebase API key from tracked project files after a GitHub Secret Scanning alert.

## Modified files
- `.env.example`
- `.gitignore`
- `google-services.json`
- `google-services.json.example`
- `src/services/firebaseClient.ts`
- `src/services/authService.ts`
- `src/services/databaseService.ts`
- `src/services/storageService.ts`

## Firebase configuration
The Firebase Web API key must now be provided through `NEXT_PUBLIC_FIREBASE_API_KEY`. The Android `google-services.json` file is ignored and represented only by `google-services.json.example`.

## Test method
Searched the working tree for `AIzaSy` patterns excluding `.git`, `.next`, and `node_modules`, then ran `npm run build`.

## Test result
No `AIzaSy` key pattern remains in the working tree. `npm run build` passed.

## Remaining issues
The exposed key still exists in the pushed Git history until the initial commit is amended and force-pushed. The key must be revoked or rotated in Google Cloud Console before closing the GitHub alert.

## Next work
Revoke or rotate the leaked key in Google Cloud, then rewrite the initial commit and force-push the sanitized repository.

---

## Work date
2026-06-23

## Work content
Debugged and fixed the App Hosting client-side startup failure caused by Firebase configuration throwing during client initialization.

## Modified files
- `.env.example`
- `apphosting.yaml`
- `docs/app-hosting.md`
- `docs/work-log.md`
- `src/app/error.tsx`
- `src/components/auth/ProfilePanel.tsx`
- `src/components/community/CommunityPanel.tsx`
- `src/components/market/MarketPanel.tsx`
- `src/services/firebaseClient.ts`
- `src/viewmodels/AuthViewModel.ts`
- `src/viewmodels/PostViewModel.ts`
- `src/viewmodels/MarketViewModel.ts`
- `src/viewmodels/ProfileViewModel.ts`

## Firebase configuration
Firebase client config now uses only `NEXT_PUBLIC_` variables for browser code. Missing values are reported as UI errors instead of crashing the whole app.

## Test method
Ran project-wide searches for SSR-unsafe browser APIs, local JSON/file DB dependencies, and leaked Google API key patterns. Ran `npm install` and `npm run build`.

## Test result
`npm install` completed successfully. `npm run build` passed. No matching SSR-unsafe browser API usage, local file DB usage, or leaked key pattern was found.

## Remaining issues
Create the App Hosting secret `firebase-web-api-key`, then verify the hosted URL after rollout.

## Next work
Push the fix to GitHub and verify the App Hosting deployment.

---

## Work date
2026-06-23

## Work content
Replaced the custom signup email-code verification with Firebase Authentication's built-in email verification link and kept live password confirmation/strength validation.

## Modified files
- `src/components/auth/AuthPanel.tsx`
- `src/services/firebaseAdmin.ts`
- `src/styles/globals.css`
- `database.rules.json`
- `.env.example`
- `apphosting.yaml`
- `docs/authentication.md`
- `docs/work-log.md`

## Firebase configuration
Firebase Authentication now sends the email verification link. No SMTP or custom verification-code database records are required.

## Test method
Run dependency installation and production build.

## Test result
`npm install` completed and `npm run build` passed after removing the custom code email API and SMTP dependencies.

## Remaining issues
Confirm the Firebase Authentication email template and authorized domains in Firebase Console.

---

## Work date
2026-06-23

## Work content
Handled Firebase `auth/too-many-requests` more safely by disabling duplicate form submits, adding a resend verification cooldown, and stopping automatic verification email sends during unverified login attempts.

## Modified files
- `src/components/auth/AuthPanel.tsx`
- `src/services/authService.ts`
- `src/services/firebaseClient.ts`
- `src/viewmodels/AuthViewModel.ts`
- `docs/authentication.md`
- `docs/work-log.md`

## Firebase configuration
No Firebase Console change is required for this code fix. Existing Firebase rate limits can only be cleared by waiting.

## Test method
Run `npm run build`.

## Test result
`npm run build` passed.

## Remaining issues
Retry signup after Firebase's temporary rate limit expires.
