## Packages
(none needed)

## Notes
Auth is custom (customers) via cookie session: use /api/customer/me to detect logged-in state
All fetch requests must include credentials: "include"
Before/After images are dynamic URLs returned by /api/before-after (render as <img src={url} />)
SEO: set document.title + meta description per route (client-side)
Testing: add data-testid to key buttons/inputs/links/cards
