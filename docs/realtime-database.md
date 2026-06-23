# Firebase Realtime Database

## Work date
2026-06-23

## Work content
Added Realtime Database service functions for user profiles, community posts, market items, sold status, and live subscriptions.

## Modified files
- `src/services/databaseService.ts`
- `src/models/UserModel.ts`
- `src/models/PostModel.ts`
- `src/models/CommentModel.ts`
- `src/models/MarketItemModel.ts`
- `src/viewmodels/PostViewModel.ts`
- `src/viewmodels/MarketViewModel.ts`
- `database.rules.json`

## Firebase configuration
Rules are stored in `database.rules.json`. User profiles are private by UID, while posts and market listings are publicly readable and owner-writable.

## Test method
After deploying rules, create a post and market item from the Firebase App Hosting URL and verify saved data under `posts` and `marketItems`.

## Test result
Remote database write testing was not run because deployment credentials and `.env.local` are not configured in this workspace.

## Remaining issues
Add validation rules for required fields and indexes after the final data schema is confirmed.

## Next work
Add comments, likes, notifications, trust score, and points workflows.
