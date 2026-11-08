---
name: autozoom-demo-scenes
description: Turn any feature, page or dashboard in the current project into a polished AutoZoom-style demo video with Remotion. The product UI is rebuilt (or imported) from the project's own code, then "filmed" on a wallpaper desktop with AutoZoom's smooth auto-zoom camera, a real-feeling cursor and clicks, spotlights, typing, keycaps, word-by-word captions, toasts and a REC chip, and rendered to MP4. Installs Remotion automatically. Use when someone asks for a demo video, feature walkthrough, product/launch video, onboarding animation, landing-page hero video, "show how X works", or anything in "AutoZoom style".
---

# AutoZoom demo videos

You are inside the user's project. Read the real code of the feature, rebuild its screen as a React component in a Remotion project, and film it the way AutoZoom films a screen recording: the camera auto-zooms onto each action. Code-built screens beat screenshots: text types into the real input, rows slide in, buttons change state, and everything stays sharp at any zoom.

Files in this skill:
- `scripts/setup.mjs` creates the Remotion project and installs it (Remotion + React).
- `assets/remotion-template/` is what it copies: the auto-zoom camera, window, cursor, spotlights, overlays and an example screen and story. **Only `src/story.tsx` and `src/screens/*` change per demo.**
- `references/story-api.md` documents every story field, the screen hooks and how to measure positions. Read it before writing a story.
- `references/style.md` is the AutoZoom look: frame, motion and overlays.

## Workflow

### 1. Pin down the story
Agree on one thing the viewer should learn, in one sentence ("Search any metric, then share it in one click"). Keep it to **6–15 seconds** and **2–4 beats**. One idea per video: if there are two features, make two videos. Ask only if the feature to show is unclear; otherwise pick the most impressive flow.

### 2. Read the project
Find what the demo shows:
- the route, page or component and its children;
- design tokens: Tailwind config, CSS variables, theme files;
- fonts, the icon library, logo;
- realistic sample data: fixtures, seeds, Storybook stories, mocks, tests.

Never invent a different look. The demo must look like **their** product.

### 3. Set up Remotion
```bash
node <skill-dir>/scripts/setup.mjs demo     # creates ./demo and installs it
```
Re-running is safe. Add `demo/` to the project's workspace or leave it standalone.

### 4. Build the screen (`demo/src/screens/<Name>.tsx`)
Draw it at the story viewport (default 1440 × 900, like a browser window). Pick the route that fits the project:

- **A. Import the real components (React projects).** Best fidelity. Works when components are presentational. Give them static props and data, and wrap them in any providers they need (theme, router, query client, i18n) with stub values. Never let them fetch from the network or read auth. Make aliases resolve and load their styles; see `references/story-api.md` › "Using the project's own components".
- **B. Rebuild it (any stack: Svelte, Vue, Angular, native, or React with heavy runtime dependencies).** Port the page to React with the same structure, class names or values, colours, radii, spacing, font, icons and copy, read straight from the source. Include only what's visible on screen.

Either way:
- Use realistic data from the project (names, numbers, statuses), never lorem ipsum.
- Give the elements the story aims at known positions. Lay them out so you can state their boxes, or measure with the debug grid (step 6).
- Make the screen **animate itself** with the hooks in `src/lib/hooks.ts` (`useTyped`, `useAfter`, `useProgress`, `usePop`, `useCount`). Pass frame numbers in as props from the story, so the timeline lives in one place. `src/screens/MockDashboard.tsx` is the worked example.

### 5. Write the story (`demo/src/story.tsx`)
Start with the timeline as a comment, in frames (fps 60):
```
0–60     overview; cursor heads to search, clicks (58)
60–130   camera zooms onto search
140–260  query types itself; caption 1
268      ↵; results update
280–345  camera pulls back to the result
...      camera + cursor travel → click → result → toast; caption 2
520–600  camera eases back out
```
Then fill in `camera`, `cursor`, `clicks`, `keys`, `captions`, `toasts` and `spotlights`, all in screen px. Leave `rec` off: overlays in the corners sit on top of the app when zoomed. The field reference is in `references/story-api.md`.

### 6. Check stills, then render
```bash
cd demo
npx remotion still Demo out/f.png --frame=150    # look at key frames (read the PNG)
npm run studio                                   # live preview for the user
npm run render                                   # → out/demo.mp4
```
Set `debug: true` in the story to draw a labelled 100px grid over the screen, so positions can be read off a still. Turn it off before rendering. Check a still at every beat: the subject is fully in frame when zoomed, the cursor tip sits on the target, text is readable, and the overlays don't cover the action.

### 7. Hand over
Give the user the MP4 path and show a frame or two. Optionally embed the live composition on their site with `@remotion/player` (see `references/story-api.md`).

## Motion rules (the AutoZoom feel)

- **Auto-zoom camera:** either the whole window (1×) or a clear close-up (1.6–2.2×), never in between: a 1.1–1.5× zoom just crops the window and looks broken. Zoom onto what matters, hold, travel directly to the next thing, and end back at 1×. Moves take 60–100 frames; holds last at least 50 frames. Use `ease: 'smooth'` (the default) for travel and `'snap'` only for quick arrivals. No motion blur.
- **Cursor:** arrives first, then clicks (press dip + ripple, automatic at each frame in `clicks`), then the result shows 2–6 frames later. While typing, move it aside slightly so it doesn't cover the text.
- **Order of a beat:** camera starts moving → cursor arrives → click → state change → toast or keycap → caption carries the meaning.
- **Captions:** what a presenter would say, 3–6 words per line, two lines per video at most.
- **Overlays** (captions, keycaps, toasts, REC) stay outside the camera: they don't zoom, and never cover the action.
- **Restraint:** one accent colour, no confetti, no spinning, no bouncy text. The product is the star.

## Quality checklist
- [ ] Looks like their product: same font, colours, copy and data.
- [ ] Timeline comment at the top of story.tsx; frame numbers come from one place.
- [ ] Every beat checked with a still; nothing important clipped while zoomed or covered by overlays.
- [ ] Cursor lands exactly on targets; clicks come before results.
- [ ] Text readable at 1080p; captions short.
- [ ] `debug` is off, and the render finishes without errors.
