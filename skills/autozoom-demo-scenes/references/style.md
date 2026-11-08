# AutoZoom style

Two layers, two rules:

- **The product screen looks like the product.** Use its own font, colours, spacing, icons, copy and data. Don't restyle it.
- **Everything around it is AutoZoom:** the wallpaper desktop, macOS window, auto-zoom camera, cursor, clicks, spotlights and overlays. These are built into the template; keep their defaults.

## The frame (built in)

- Desktop: a vivid wallpaper (`public/wallpaper.jpg`) behind a macOS window with traffic lights and a URL bar (`chrome: 'browser'`) or a title (`chrome: 'app'`).
- Window: about 86% of the frame width, centred, with a soft deep shadow, a 1px light ring and rounded corners.
- Cursor: the macOS arrow, black with a white outline and a soft shadow; ripple on click.
- Overlays use dark glass (`rgba(0,0,0,.6)` + backdrop blur), white text, and weights 500–600:
  - REC chip top-left: red dot `#ff453a`;
  - toast top-centre: green check `#30d158`;
  - keycaps low-centre;
  - captions bottom-centre: words go from 32% white → brief blue `#74b4ff` → white.

## Motion

- Easing: smooth in-out `bezier(.45, 0, .15, 1)` for camera and cursor travel; fast-out `bezier(.23, 1, .32, 1)` for arrivals and pops.
- Auto-zoom: the whole window (1×) or a clear close-up (1.6–2.2×), never in between. Hold each important state ≥ 0.8 s. A camera move takes 1–1.6 s.
- No motion blur or other blur effects on the screen.
- No bounce on text, no confetti, no spin, no glow.

## When there's no product UI to copy (mocks)

Use the calm dark system the example screen uses:

| Token | Value |
|---|---|
| window / sidebar | `#111113` / `#0d0d0f` |
| surface | `rgba(255,255,255,.03–.06)` + `inset 0 0 0 1px rgba(255,255,255,.07)` |
| hairline | `rgba(255,255,255,.06)` |
| text / secondary / label | `#ececee` / `#a1a1aa` / `#5c5c63` |
| one accent | `#2f7bf6` (focus rings, a single highlighted bar) |
| success | `#30d158` with `#032611` text |
| primary button | white with black text, pill |

- Type: Inter or system UI, weights 400/500/600, headings at `-0.02em`, sentence case, tabular numbers.
- Tags: grey pills with a small coloured dot. Avatars: coloured circles with initials.

## Readability

The video is usually watched at 1080p or smaller. In a 1440-wide viewport, keep body text ≥ 14px and key labels ≥ 15px. Zoom in when the point is in small text: that's what the camera is for.
