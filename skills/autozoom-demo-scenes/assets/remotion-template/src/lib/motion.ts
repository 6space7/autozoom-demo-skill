import { Easing } from 'remotion';
import type { CameraKey, CursorKey, Ease, ScrollKey } from '../types';

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export const EASE: Record<Ease, (t: number) => number> = {
	smooth: Easing.bezier(0.45, 0, 0.15, 1),
	snap: Easing.bezier(0.23, 1, 0.32, 1),
	linear: (t) => t
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Find the segment around `frame` and its eased progress. */
function segment<K extends { at: number; ease?: Ease }>(keys: K[], frame: number) {
	if (frame <= keys[0].at) return { a: keys[0], b: keys[0], t: 0 };
	for (let i = 1; i < keys.length; i++) {
		const a = keys[i - 1];
		const b = keys[i];
		if (frame <= b.at) {
			const raw = b.at === a.at ? 1 : (frame - a.at) / (b.at - a.at);
			return { a, b, t: EASE[b.ease ?? 'smooth'](raw) };
		}
	}
	const last = keys[keys.length - 1];
	return { a: last, b: last, t: 0 };
}

/** Window placement on the canvas. `k` maps screen px → canvas px. */
export function layout(W: number, H: number, vw: number, vh: number) {
	const bar = Math.round(H * 0.04);
	const k = Math.min((W * 0.84) / vw, (H * 0.8 - bar) / vh);
	const ww = vw * k;
	const wh = vh * k + bar;
	const x = (W - ww) / 2;
	const y = (H - wh) / 2;
	return { k, bar, x, y, ww, wh, toCanvas: (p: [number, number]) => [x + p[0] * k, y + bar + p[1] * k] as const };
}

export type Lay = ReturnType<typeof layout>;

/**
 * Auto-zoom camera at a frame: zoom + focus interpolate separately, then the
 * translate centres the focus and is clamped so the desktop never shows an
 * edge. Transform with origin 0 0: translate(tx, ty) scale(s).
 */
export function cameraAt(keys: CameraKey[], frame: number, W: number, H: number, lay: Lay, vw: number, vh: number) {
	const centre: [number, number] = [vw / 2, vh / 2];
	const { a, b, t } = segment(keys, frame);
	const s = lerp(a.zoom, b.zoom, t);
	const fa = lay.toCanvas(a.focus ?? centre);
	const fb = lay.toCanvas(b.focus ?? centre);
	const fx = lerp(fa[0], fb[0], t);
	const fy = lerp(fa[1], fb[1], t);
	const tx = clamp(W / 2 - s * fx, W - s * W, 0);
	const ty = clamp(H / 2 - s * fy, H - s * H, 0);
	return { s, tx, ty };
}

/** Cursor position (screen px) with a gentle arc on longer moves, like a real hand. */
export function cursorAt(keys: CursorKey[], frame: number) {
	const { a, b, t } = segment(keys, frame);
	const dx = b.x - a.x;
	const dy = b.y - a.y;
	const len = Math.hypot(dx, dy);
	const bow = Math.sin(Math.PI * t) * Math.min(len * 0.08, 40);
	const nx = len ? -dy / len : 0;
	const ny = len ? dx / len : 0;
	return { x: lerp(a.x, b.x, t) + nx * bow, y: lerp(a.y, b.y, t) + ny * bow };
}

export function scrollAt(keys: ScrollKey[] | undefined, frame: number) {
	if (!keys?.length) return 0;
	const { a, b, t } = segment(keys, frame);
	return lerp(a.y, b.y, t);
}
