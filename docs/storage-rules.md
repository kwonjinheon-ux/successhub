# Firebase Storage Rules

## Work date
2026-06-23

## Work content
Added Storage upload helpers and owner-based Storage Rules for profile images, post attachments, market images, and private files.

## Modified files
- `src/services/storageService.ts`
- `storage.rules`

## Firebase configuration
Public reads are allowed for profile, post, and market images. Writes require an authenticated user whose UID matches the first path segment.

## Test method
Deploy Storage Rules, upload images from authenticated flows, then verify files are saved under `profiles/{uid}`, `posts/{uid}`, or `market/{uid}`.

## Test result
Remote Storage testing was not run because deployment and authenticated browser testing require confirmed Firebase access.

## Remaining issues
Wire image upload controls into community and market forms.

## Next work
Add image previews, upload progress, and delete support.

---

## Work date
2026-06-23

## Work content
Fixed profile image upload authorization by deploying Storage Rules for `profiles/{uid}` and separating create/update validation from delete rules.

## Modified files
- `storage.rules`
- `firebase.json`
- `firestore.rules`
- `firestore.indexes.json`
- `src/services/firebaseClient.ts`
- `src/services/databaseService.ts`
- `src/components/auth/ProfilePanel.tsx`
- `src/models/UserModel.ts`

## Firebase configuration
Profile images are stored in Firebase Storage under `profiles/{uid}/{fileName}`. Authenticated users can create/update/delete only under their own UID path. Profile metadata is stored in Cloud Firestore `users/{uid}`.

## Test method
Ran `npm run build`, `firebase deploy --only firestore:rules,storage --dry-run --project success-hub-2026`, then deployed Firestore and Storage rules.

## Test result
Build passed. Firestore and Storage rules compiled and deployed successfully.

## Remaining issues
Review and harden prototype Firestore Security Rules before broad public launch.
