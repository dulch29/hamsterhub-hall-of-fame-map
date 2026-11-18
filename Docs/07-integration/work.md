# 07 — Member authentication and site integration

Milestone: production prerequisite before M6. Owner: lead.

## Scope

Mount the feature in Hamsterhub using its confirmed stack and enforce the member boundary on both the page and data API. An unauthenticated request must receive no student data.

- Reuse the host's confirmed session and membership mechanism.
- Enforce opt-in and authorized field selection before serializing responses.
- Expose only province-level location and derived anchor-plus-jitter positions, if positions are returned.
- Preserve noindex behavior without treating it as authentication.
- Define loading, session expiry, logout, errors, and cache behavior for map and list.
- Connect production Profile/project URLs and any agreed featured-selection setting.

Backend paths and services are TBD. Supabase is not a selected dependency. Proposed client adapter location: `src/data/*`.

## Dependencies

Package 01 must identify the site stack, mount point, membership rules, backend, and setting ownership. Package 03 defines shared data preparation. Real data remains disconnected until this boundary is verified.

## Completion criteria

- [ ] Direct logged-out page/API requests expose no student data.
- [ ] Authorized responses exclude opted-out students and precise locations.
- [ ] Login, expiry, logout, and account changes do not leave student data accessible.
- [ ] Host navigation, styles, links, and errors work in the intended mount point.
- [ ] The protected endpoint and integration contract are documented.

Continue with [the implementation plan](plan.md).
