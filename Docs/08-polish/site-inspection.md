# Hamsterhub site inspection

Observed 2026-11-17 from public HTTPS responses at https://www.hamsterhub.co/.
Snapshots are in ignored `.agent-exchanges/site.html` and `site.css`.

The document title is `HamsterHub — เรียนรู้ สร้าง แข่งขัน`. The HTML references
`/_next/static/` scripts, stylesheets and font preloads. This is evidence of a
Next.js-delivered page; it does not confirm repository access, the authenticated
application stack, an embeddable route or its session implementation.

CSS defines navy `#16325b`, blue `#3894ff`, dark blue `#1b77ee`, yellow `#ffdc50`,
off-white `#faf3f1`, red `#dc4a44`, and gray `#323232`. It includes Noto Sans Thai,
Kanit fallbacks and generated Geist font declarations in different stylesheet
sections. The demo uses navy for text, blue for accents, yellow for occupied
provinces and off-white around a pale-blue map. It uses local/system font
fallbacks; no third-party font request or copied site logo is required.

Design plan: a quiet header and short introduction lead into one large map,
with a maker list alongside on desktop and below on phones. The 3D province
surface is the main visual element. Controls, filters and modal use the same
palette. There is no idle animation loop; controls render on demand and motion
does not require a reduced-motion exception.

The local test page is a brand-informed prototype, not an authenticated page
integrated into the live site. Profile routes, session/API integration and
approved member navigation remain unresolved.
