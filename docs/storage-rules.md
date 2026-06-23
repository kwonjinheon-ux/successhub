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
