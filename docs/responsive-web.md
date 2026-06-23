# Responsive Web Requirement

## Work date
2026-06-23

## Mandatory rule
Success Hub 2026 must always be optimized as a responsive web site. Every page, panel, form, navigation area, profile view, marketplace view, and community view must work on mobile, tablet, and desktop screens.

## Implementation standard
- Use flexible layouts with `min()`, responsive grids, wrapping controls, and mobile breakpoints.
- Avoid fixed-width UI that can overflow on small screens.
- Buttons and form controls must remain tappable on mobile.
- Text must wrap inside its container without overlapping adjacent content.
- Logged-in member cards must show the profile image as a circular avatar when available.
- Profile editing must remain usable on narrow screens.

## Current implementation
- The page shell uses responsive width constraints.
- Main hero content and navigation stack on mobile.
- Auth/social buttons become full-width on small screens.
- Password validation chips wrap and become full-width on very narrow screens.
- Profile editor stacks vertically on mobile.
- Logged-in member summary displays a circular profile image or initial fallback.

## Test method
Run `npm run build` and verify `/`, `/login`, `/signup`, and `/profile` at mobile and desktop widths after deployment.

## Remaining work
Continue checking each new feature against this responsive requirement before pushing.
