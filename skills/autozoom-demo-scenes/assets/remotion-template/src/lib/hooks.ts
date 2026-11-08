import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { EASE } from './motion';
import type { Ease } from '../types';

/*
 * Hooks for animating a screen from inside its own components. Pass the
 * story's frame numbers in as props so the whole timeline stays in story.tsx.
 */

/** True from `at` onwards (and before `until`, if given). Use for state flips: selected, done, open. */
export function useAfter(at: number, until?: number) {
	const frame = useCurrentFrame();
	return frame >= at && (until === undefined || frame < until);
}

/** 0 → 1 between two frames, eased. Use for bars growing, counters, fades, progress. */
export function useProgress(from: number, to: number, ease: Ease = 'smooth') {
	const frame = useCurrentFrame();
	return EASE[ease](interpolate(frame, [from, to], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
}

/** A settled spring from `at` (0 → 1, slight overshoot). Use for things popping in: rows, toasts, menus. */
export function usePop(at: number) {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	return spring({ frame: frame - at, fps, config: { damping: 18, stiffness: 180, mass: 0.8 } });
}

/**
 * Text typed into a field, starting at `at`, `cps` characters per second.
 * Returns what's typed so far, whether typing has started, and a caret flag
 * (solid while typing, blinking after). Render it inside the REAL input
 * element of the rebuilt screen, replacing its placeholder.
 */
export function useTyped(at: number, text: string, cps = 14) {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	if (frame < at) return { value: '', started: false, caret: false };
	const n = Math.min(text.length, Math.floor(((frame - at) / fps) * cps));
	const typing = n < text.length;
	return { value: text.slice(0, n), started: true, caret: typing || Math.floor((frame - at) / (fps * 0.5)) % 2 === 0 };
}

/** Count a number up between frames (e.g. 12 → 13 tasks, $41.0k → $48.2k). */
export function useCount(from: number, to: number, a: number, b: number) {
	return a + (b - a) * useProgress(from, to, 'snap');
}
