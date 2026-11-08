import { interpolate, useCurrentFrame } from 'remotion';
import { story } from '../story';
import { EASE, cursorAt, scrollAt, type Lay } from '../lib/motion';

const fade = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/**
 * Everything drawn in SCREEN pixels (the story viewport), scaled into the
 * window: screens, spotlights and the cursor. It sits inside the camera,
 * so it all zooms together like a real recording.
 */
export const ScreenLayer = ({ lay }: { lay: Lay }) => {
	const frame = useCurrentFrame();
	const [vw, vh] = story.viewport;
	const scrollY = scrollAt(story.scroll, frame);

	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				top: lay.bar,
				width: vw,
				height: vh,
				transformOrigin: '0 0',
				transform: `scale(${lay.k})`,
				overflow: 'hidden',
				background: '#111113'
			}}
		>
			{/* Screens: each later one cross-fades in over 10 frames. */}
			{story.screens.map((s, i) => {
				if (frame < s.from) return null;
				const opacity = i === 0 ? 1 : interpolate(frame, [s.from, s.from + 10], [0, 1], fade);
				return (
					<div key={i} style={{ position: 'absolute', inset: 0, opacity }}>
						<div style={{ position: 'absolute', left: 0, top: 0, width: vw, transform: `translateY(${-scrollY}px)` }}>
							<div style={{ position: 'relative', width: vw, height: s.pageHeight ?? vh }}>{s.element}</div>
						</div>
					</div>
				);
			})}

			{/* Spotlights: dim everything but one box. */}
			{story.spotlights?.map((s, i) => {
				const o = interpolate(frame, [s.from, s.from + 12, s.to - 12, s.to], [0, 1, 1, 0], fade);
				if (o <= 0) return null;
				const [x, y, w, h] = s.box;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x - 8,
							top: y - 8 - scrollY,
							width: w + 16,
							height: h + 16,
							borderRadius: s.radius ?? 14,
							boxShadow: `0 0 0 9999px rgba(0,0,0,${0.6 * o}), 0 0 0 2px rgba(255,255,255,${0.85 * o})`
						}}
					/>
				);
			})}

			{story.cursor?.length ? <Cursor /> : null}
			{story.debug ? <Grid w={vw} h={vh} /> : null}
		</div>
	);
};

const Cursor = () => {
	const frame = useCurrentFrame();
	const { x, y } = cursorAt(story.cursor!, frame);

	let press = 1;
	const ripples: { p: number }[] = [];
	for (const c of story.clicks ?? []) {
		if (frame >= c - 4 && frame <= c + 8) press = Math.min(press, interpolate(frame, [c - 4, c, c + 8], [1, 0.8, 1], fade));
		if (frame >= c && frame <= c + 26) ripples.push({ p: (frame - c) / 26 });
	}

	return (
		<div style={{ position: 'absolute', left: x, top: y, width: 0, height: 0 }}>
			{ripples.map((r, i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: -26,
						top: -26,
						width: 52,
						height: 52,
						borderRadius: 999,
						border: '3px solid rgba(255,255,255,0.85)',
						background: 'rgba(255,255,255,0.15)',
						opacity: 1 - r.p,
						transform: `scale(${0.3 + 1.3 * EASE.snap(r.p)})`
					}}
				/>
			))}
			<svg
				viewBox="0 0 20 26"
				width={24}
				height={31}
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					overflow: 'visible',
					transformOrigin: '10% 6%',
					transform: `translate(-2px, -1.5px) scale(${press})`,
					filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.45))'
				}}
			>
				<path
					d="M2 1.5 L2 20.5 L6.8 16.2 L10 23.8 L13.4 22.3 L10.3 14.9 L16.8 14.6 Z"
					fill="#000"
					stroke="#fff"
					strokeWidth={1.6}
					strokeLinejoin="round"
				/>
			</svg>
		</div>
	);
};

/** Labelled grid in screen px, for reading coordinates off `npm run still`. */
const Grid = ({ w, h }: { w: number; h: number }) => (
	<div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
		{Array.from({ length: Math.floor(w / 100) + 1 }, (_, i) => (
			<div key={`x${i}`} style={{ position: 'absolute', left: i * 100, top: 0, bottom: 0, width: 1, background: 'rgba(255,45,85,0.55)' }}>
				<span style={{ position: 'absolute', top: 2, left: 3, font: '600 11px system-ui', color: '#ff2d55' }}>{i * 100}</span>
			</div>
		))}
		{Array.from({ length: Math.floor(h / 100) + 1 }, (_, i) => (
			<div key={`y${i}`} style={{ position: 'absolute', top: i * 100, left: 0, right: 0, height: 1, background: 'rgba(255,45,85,0.55)' }}>
				<span style={{ position: 'absolute', left: 3, top: 2, font: '600 11px system-ui', color: '#ff2d55' }}>{i * 100}</span>
			</div>
		))}
	</div>
);
