# Firebase App Hosting

## Work date
2026-06-23

## Work content
Added App Hosting configuration for a Next.js app and kept runtime configuration in environment variables.

## Modified files
- `firebase.json`
- `apphosting.yaml`
- `next.config.ts`
- `package.json`

## Firebase configuration
The App Hosting backend ID is `success-hub-2026`. The project must be on the Blaze plan to use Firebase App Hosting.

## Test method
Run `npm run build`, confirm Firebase login and active project, then deploy or connect the backend to GitHub for push-based deployment.

## Test result
`npm run build` passed on 2026-06-23. Remote App Hosting deployment was not run because billing plan, backend existence, and GitHub connection need confirmation.

## Remaining issues
Set secrets for server-only Firebase Admin SDK values with App Hosting secrets.

## Next work
Connect GitHub main branch to Firebase App Hosting and verify the deployed URL.

---

## Work date
2026-06-23

## Work content
Fixed a production client-side exception path caused by missing Firebase public environment variables during App Hosting startup.

## Modified files
- `apphosting.yaml`
- `.env.example`
- `src/services/firebaseClient.ts`
- `src/viewmodels/AuthViewModel.ts`
- `src/viewmodels/PostViewModel.ts`
- `src/viewmodels/MarketViewModel.ts`
- `src/viewmodels/ProfileViewModel.ts`
- `src/components/auth/ProfilePanel.tsx`
- `src/components/community/CommunityPanel.tsx`
- `src/components/market/MarketPanel.tsx`
- `src/app/error.tsx`

## Firebase configuration
The app uses these browser-safe environment variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

`NEXT_PUBLIC_FIREBASE_DATABASE_URL` remains optional for Realtime Database support.

App Hosting now references secrets named `firebase-web-api-key` and `firebase-web-app-id`. Create or update them with:

```bash
npx -y firebase-tools@latest apphosting:secrets:set firebase-web-api-key --project nature-link-abd07
npx -y firebase-tools@latest apphosting:secrets:set firebase-web-app-id --project nature-link-abd07
```

If access is not automatically granted, run:

```bash
npx -y firebase-tools@latest apphosting:secrets:grantaccess firebase-web-api-key --project nature-link-abd07
npx -y firebase-tools@latest apphosting:secrets:grantaccess firebase-web-app-id --project nature-link-abd07
```

## Test method
Searched for SSR-unsafe browser API usage, local file DB usage, and exposed `AIzaSy` key patterns. Ran `npm install` and `npm run build`.

## Test result
No SSR-unsafe browser API usage, local file DB usage, or exposed key pattern was found in the working tree. `npm install` and `npm run build` passed.

## Remaining issues
The deployed domain `successhub--success-hub-2026.asia-southeast1.hosted.app` must be added to Firebase Authentication authorized domains if social/email auth reports `auth/unauthorized-domain`.

## Next work
Set App Hosting secrets, push to GitHub, allow App Hosting to roll out, and test the hosted URL.
