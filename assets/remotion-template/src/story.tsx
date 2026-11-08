import type { Story } from './types';
import { MockDashboard } from './screens/MockDashboard';

/*
 * THE ONLY FILE TO EDIT FOR A NEW DEMO.
 *
 * Story: "Search any metric, then share it in one click." 10s @ 60fps.
 *   0–60     overview; cursor heads for search and clicks (58)
 *   60–130   camera zooms onto search
 *   140–260  "Revenue by region" types itself; caption 1
 *   262      ↵ keycap; the chart re-shapes (268)
 *   280–345  camera pulls back to the whole window; the chart has changed
 *   345–400  camera + cursor travel to Share; click (398)
 *   400–520  Share is green, toast; caption 2
 *   520–600  camera eases back out
 *
 * All positions are SCREEN px in the viewport below, read from the screen's
 * own layout. Frames = seconds × fps.
 */
const SEARCH: [number, number] = [482, 56];
const SHARE: [number, number] = [1324, 56];

// Moments the screen reacts to (it animates itself from these).
const T = { focus: 58, type: 140, query: 'Revenue by region', update: 268, share: 398 };

export const story: Story = {
	fps: 60,
	durationInFrames: 600,
	size: [1920, 1200],
	viewport: [1440, 900],
	chrome: 'browser',
	url: 'app.acme.com/overview',
	wallpaper: 'wallpaper.jpg',

	// The product UI, rebuilt from the project's code. One live screen is usually enough.
	screens: [{ from: 0, element: <MockDashboard t={T} /> }],

	camera: [
		{ at: 0, zoom: 1 },
		{ at: 60, zoom: 1 },
		{ at: 130, zoom: 1.7, focus: SEARCH },
		{ at: 270, zoom: 1.7, focus: SEARCH },
		{ at: 320, zoom: 1 },
		{ at: 345, zoom: 1 },
		{ at: 395, zoom: 1.8, focus: SHARE },
		{ at: 490, zoom: 1.8, focus: SHARE },
		{ at: 560, zoom: 1 },
		{ at: 600, zoom: 1 }
	],

	cursor: [
		{ at: 0, x: 720, y: 720 },
		{ at: 55, x: 488, y: 62 },
		{ at: 70, x: 488, y: 62 },
		{ at: 120, x: 600, y: 120 },
		{ at: 330, x: 600, y: 120 },
		{ at: 392, x: 1330, y: 64 },
		{ at: 520, x: 1330, y: 64 },
		{ at: 600, x: 720, y: 720 }
	],
	clicks: [T.focus, T.share],

	keys: [{ at: T.update - 6, keys: ['↵'], hold: 16 }],
	captions: [
		{ from: 140, to: 268, text: 'Search any metric,' },
		{ from: 360, to: 505, text: 'then share it in one click.' }
	],
	toasts: [{ from: 404, to: 520, text: 'Link copied to clipboard' }],

	rec: false
};
