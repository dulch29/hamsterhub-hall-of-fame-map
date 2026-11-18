# Motion review

Review this motion pass for correctness and accessibility. Read the supplied
source snapshot; do not claim to run commands. Focus on camera interruption,
focus through cluster zoom and fan-out, reduced motion, stable marker hit areas,
native dialog exit races, cleanup and idle performance. Report concrete P0/P1/P2
issues with source locations and fixes, or state none found. Keep this bounded.

User direction: preserve the simple extruded 3D Thailand demo; make markers feel
like firefly/star clusters and add restrained interaction feedback.

Implemented: 240ms camera travel for pointer controls (keyboard immediate);
on-demand rendering; CSS glow/drift on inner decorations with a pause button;
fan-out entrance via WAAPI; modal CSS entrance/exit with native focus handling.
Reduced motion disables decorative motion and uses immediate camera/dialog.
No dependencies added. Default three synthetic students and all privacy/data
contracts remain unchanged. Physical-device motion feel is not verified.
