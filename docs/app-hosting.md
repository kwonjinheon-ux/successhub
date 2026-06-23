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
