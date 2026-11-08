import type { ReactNode } from 'react';

/** A point in SCREEN pixels: the viewport the UI is drawn at (e.g. 1440 × 900), origin top-left. */
export type Pt = [x: number, y: number];
/** A box in screen pixels: [x, y, width, height]. */
export type Box = [x: number, y: number, w: number, h: number];

/**
 * Easing between two keyframes (camera, cursor, scroll). Set on the keyframe a move ENDS at.
 * smooth = calm in-out (default) · snap = fast out (arrivals, pops) · linear.
 */
export type Ease = 'smooth' | 'snap' | 'linear';

export type Screen = {
	/** Frame this screen appears at (cross-fades in over 10 frames). Most demos need one screen. */
	from: number;
	/**
	 * The product UI, rebuilt (or imported) from the project's code and drawn at
	 * viewport size. It can animate itself with the hooks in lib/hooks.ts.
	 */
	element: ReactNode;
	/** Total height in screen px for a long page; use with `scroll`. */
	pageHeight?: number;
};

export type CameraKey = {
	at: number;
	/** 1 = whole window. Close-ups 1.6–2.2; avoid 1.1–1.5 (just crops the window). */
	zoom: number;
	/** What to centre on, in screen px. Defaults to the screen centre. The view is clamped so no edge shows. */
	focus?: Pt;
	ease?: Ease;
};

export type CursorKey = { at: number; x: number; y: number; ease?: Ease };

export type Spotlight = { from: number; to: number; box: Box; radius?: number };
export type Caption = { from: number; to: number; text: string };
export type Keys = { at: number; keys: string[]; hold?: number };
export type Toast = { from: number; to: number; text: string };
export type ScrollKey = { at: number; y: number; ease?: Ease };

export type Story = {
	fps: number;
	durationInFrames: number;
	/** Output size. Default 1920 × 1200 (16:10). */
	size?: [number, number];
	/** Screen size the UI is laid out at (like a browser window). */
	viewport: [number, number];
	/** Window chrome: 'browser' shows a URL bar, 'app' just traffic lights and a title. */
	chrome: 'browser' | 'app';
	title?: string;
	url?: string;
	/** Desktop background: an image in public/ or any CSS background. */
	wallpaper?: string;

	screens: Screen[];
	/** Auto-zoom keyframes. Repeat a keyframe to hold. */
	camera: CameraKey[];
	cursor?: CursorKey[];
	clicks?: number[];
	scroll?: ScrollKey[];
	spotlights?: Spotlight[];
	captions?: Caption[];
	keys?: Keys[];
	toasts?: Toast[];
	/** REC chip with a running timer. */
	rec?: boolean;
	/** Draw a labelled 100px grid over the screen, to read positions off a still. Turn off before rendering. */
	debug?: boolean;
};
