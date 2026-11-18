# 09 — Real data, consent, and release

Milestone: M6. Owner: lead with the organization; Codex supports assigned UI work.

## Scope

Replace the synthetic source with the confirmed protected production adapter only after membership and consent prerequisites are satisfied.

- Collect approved display names, avatars, province, Profile/project links, and manual featured selection.
- Default `showOnMap` to false and publish only opted-in students with the required consent.
- Keep exact addresses, district locations, and student GPS outside this feature's storage and responses.
- Confirm the organization's consent collection and review responsibilities.
- Complete the privacy/legal review required by Project.md before launch.
- Support consent withdrawal and project deletion/visibility changes.
- Verify the full acceptance checklist and prepare a release handoff.

No real student records belong in this repository or its synthetic fixtures.

## Dependencies

Packages 01, 03, and 07 must resolve the production source, membership/consent policy, featured behavior, and protected data boundary. Packages 02–08 supply acceptance evidence for the user experience.

## Completion criteria

- [ ] Production adapter uses the confirmed source and protected member endpoint.
- [ ] Consent collection, withdrawal, and approved-field policy are documented and exercised.
- [ ] No opted-out records or precise student coordinates reach clients.
- [ ] Real Profile/project links and featured selection resolve correctly.
- [ ] Required organization review is complete.
- [ ] Every Project.md acceptance criterion has current evidence.
- [ ] Release configuration, rollback, and ongoing responsibilities are documented.

Continue with [the implementation plan](plan.md).
