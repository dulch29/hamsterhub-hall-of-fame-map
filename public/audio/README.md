# Bubble audio

Source: [Bubble Sound Effects](https://opengameart.org/content/bubble-sound-effects)
by BMacZero / Brian MacIntosh, published 2020-10-04. Retrieved 2026-11-19.
The source describes these as bubbling-water sound effects and offers them under
[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).
Optional credit: Brian MacIntosh.

- `bubble-pop.wav`: `bubbles-single2.wav` from the source page.
- `bubble-form.wav`: `bubbles-single1.wav` from the source page.

Locally hosted WAV recordings replace the previous synthesized oscillator sweep.
The player applies a quiet gain and trims leading/trailing silence by its playback
offset; no network service or generated voice/audio is involved at runtime.

Task 030 lowers playback by approximately 3 dB: pop gain `.28`, formation `.32`.
The original samples, silence offsets and mute behavior are preserved.
