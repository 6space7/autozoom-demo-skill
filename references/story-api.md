# Story API

Everything is driven by `src/story.tsx`. Positions are **screen px**: the viewport the screen component is drawn at (default 1440 × 900, origin top-left). Times are **frames** (fps 60 by default, so 60 frames = 1 s). The output is 1920 × 1200 (16:10). Set `size: [1920, 1080]` for 16:9 or `[1080, 1350]` for social posts.

## Fields

| Field | Type | What it does |
|---|---|---|
| `fps`, `durationInFrames` | number | Video length. 6–15 s is the sweet spot. |
| `size` | `[w, h]` | Output size (default `[1920, 1200]`). |
| `viewport` | `[w, h]` | Size the screen is laid out at (default `[1440, 900]`). |
| `chrome` | `'browser' \| 'app'` | `browser` shows a URL bar (set `url`); `app` shows `title`. |
| `wallpaper` | string | An image in `public/` (default `wallpaper.jpg`) or any CSS background. |
| `screens` | `{ from, element, pageHeight? }[]` | The product UI. Usually one screen that animates itself; add more to cut between pages (each cross-fades over 10 frames). |
| `camera` | `{ at, zoom, focus?, ease? }[]` | Auto-zoom keyframes. Repeat a keyframe to hold. `focus` is the screen point to centre; the view is clamped so no desktop edge shows. |
| `cursor` | `{ at, x, y, ease? }[]` | Keyframes for the cursor tip. Moves get a natural slight arc. |
| `clicks` | `number[]` | Frames where the cursor presses (dip + ripple). The cursor must already be on the target. |
| `scroll` | `{ at, y, ease? }[]` | Scrolls a tall screen (`pageHeight`). Positions stay in viewport space, so subtract the scroll yourself. |
| `spotlights` | `{ from, to, box, radius? }[]` | Dims everything except one box (great for dashboards). |
| `keys` | `{ at, keys, hold? }[]` | Keycaps, e.g. `['⌘', 'K']`, held for `hold` frames (default 24). |
| `captions` | `{ from, to, text }[]` | One line at a time; words light up as if spoken. |
| `toasts` | `{ from, to, text }[]` | Success pill at the top centre. |
| `rec` | boolean | REC chip with a running timer (off by default; it covers the app's corner when zoomed). |
| `debug` | boolean | Labelled 100px grid over the screen, for reading positions. Turn off before rendering. |

Easing: `smooth` (default, calm in-out), `snap` (fast out, for arrivals), `linear`. It's set on the keyframe a move **ends** at.

## Screen hooks (`src/lib/hooks.ts`)

Use these inside screen components, with frame numbers passed in as props from the story:

```tsx
const T = { focus: 58, type: 140, query: 'Revenue by region', update: 268, share: 398 }; // in story.tsx
screens: [{ from: 0, element: <Dashboard t={T} /> }]

// in the screen:
const typed = useTyped(t.type, t.query);        // { value, started, caret }: render inside the real input
const focused = useAfter(t.focus, t.update);    // boolean state flips
const grow = useProgress(t.update, t.update + 36, 'snap'); // 0→1: bar heights, widths, opacity
const pop = usePop(t.update);                   // spring 0→1: new rows, menus, badges
const n = useCount(t.update, t.update + 30, 12, 13); // number ticking up
```

Patterns:
- **Typing:** render `typed.value` in place of the placeholder, plus a 2px caret (`typed.caret` toggles it).
- **New row:** a wrapper with `height: rowH * pop` and `opacity: pop` slides it in and pushes the rest down naturally.
- **Button → done:** swap the label and colour on `useAfter(t.click + 2)`.
- **Menus and dropdowns:** `opacity: pop`, `transform: translateY((1 - pop) * -6px) scale(0.97 + 0.03 * pop)`.
- **Hover:** `useAfter(cursorArrives, cursorLeaves)` → the hover style.

## Measuring positions

1. Prefer layouts where the target boxes are known (absolute positions, or fixed widths you can add up).
2. Otherwise set `debug: true`, run `npx remotion still Demo out/f.png --frame=0`, read the grid in the PNG, and note centres. Each grid cell is 100 screen px.
3. Camera `focus` = the centre of what should fill the view. Cursor tip = a point slightly inside the target, e.g. 30% from its left edge and at its vertical centre.

## Using the project's own components

**Path aliases** (`@/components/...`): in `remotion.config.ts`
```ts
import path from 'node:path';
Config.overrideWebpackConfig((c) => ({
  ...c,
  resolve: { ...c.resolve, alias: { ...(c.resolve?.alias ?? {}), '@': path.resolve(process.cwd(), '../src') } }
}));
```

**Tailwind v4:** `npm i -D @remotion/tailwind-v4@4.0.496 tailwindcss @tailwindcss/postcss`, then
```ts
import { enableTailwind } from '@remotion/tailwind-v4';
Config.overrideWebpackConfig((c) => enableTailwind(c));
```
Create `src/style.css` with `@import "tailwindcss";` plus `@source "../../src";` (so it scans the project's classes) and the project's theme CSS, and import it in `Root.tsx`. Tailwind v3: use `@remotion/tailwind` and point its config `content` at the project's files.

**Global CSS / CSS modules:** import the project's global stylesheet in `Root.tsx`. CSS modules work as-is.

**Providers:** wrap the screen in what the components expect (theme, `MemoryRouter`, a `QueryClientProvider` with pre-filled data, i18n) using static values. Stub hooks that fetch or read auth. If a component is too entangled, rebuild just that part.

**Fonts:** a Google font → `@remotion/google-fonts/<Name>` with `loadFont()`. A local font → copy it to `public/fonts/`, then `loadFont({ family, url: staticFile('fonts/x.woff2') })` from `@remotion/fonts`. Use the same version as `remotion`.

**Assets:** copy logos and images into `public/` and use `staticFile('logo.svg')` with `<Img>`.

## Embedding on a website

```tsx
import { Player } from '@remotion/player';
import { Demo } from './demo/src/Demo';
<Player component={Demo} durationInFrames={600} fps={60} compositionWidth={1920} compositionHeight={1200}
  style={{ width: '100%' }} autoPlay loop muted controls={false} />
```
Or just use the rendered MP4 (`<video autoplay muted loop playsinline>`).

## Template files

- `src/Demo.tsx`: desktop + auto-zoom camera + window + overlays (rarely needs changes).
- `src/lib/motion.ts`: easing, window layout, camera, cursor and scroll math.
- `src/components/Window.tsx`: macOS window with a URL bar or title.
- `src/components/ScreenLayer.tsx`: screens, spotlights, cursor and clicks, debug grid.
- `src/components/Overlays.tsx`: REC, toasts, keycaps, captions.
- `src/screens/MockDashboard.tsx`: the example screen. Replace it.
