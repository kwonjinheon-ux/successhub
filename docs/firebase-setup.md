# Firebase Setup

## Work date
2026-06-23

## Work content
Created the Firebase-first project foundation for Success Hub 2026. The detected Firebase project ID is `nature-link-abd07`, and the Android configuration file is stored as `google-services.json`.

## Modified files
- `.env.example`
- `firebase.json`
- `apphosting.yaml`
- `database.rules.json`
- `storage.rules`
- `src/services/firebaseClient.ts`
- `src/services/firebaseAdmin.ts`

## Firebase configuration
The web app expects environment variables instead of hard-coded local URLs. The Web App ID must be copied from Firebase Web App settings into `NEXT_PUBLIC_FIREBASE_APP_ID`.

## Test method
Install dependencies, set `.env.local`, run `npm run build`, then deploy with `npx -y firebase-tools@latest deploy` after Firebase login and project confirmation.

## Test result
Remote Firebase deployment was not run because the active Firebase project and login state need user confirmation.

## Remaining issues
Enable Authentication providers, Realtime Database, Storage, and App Hosting in the Firebase console or CLI for `nature-link-abd07`.

## Next work
Confirm Firebase project access, add real web SDK config, deploy rules, then test on the Firebase App Hosting URL.
