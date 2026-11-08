import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { story } from '../story';
import { EASE } from '../lib/motion';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/**
 * What an editor adds on export: these sit OUTSIDE the camera, so they stay
 * put while the screen zooms. Sizes use u = 1% of the video width.
 */
export const Overlays = () => {
	const { width } = useVideoConfig();
	const u = width / 100;
	return (
		<>
			{story.rec ? <Rec u={u} /> : null}
			{story.toasts?.map((t, i) => <ToastPill key={i} t={t} u={u} />)}
			{story.keys?.map((k, i) => <Keycaps key={i} k={k} u={u} />)}
			{story.captions?.map((c, i) => <CaptionLine key={i} c={c} u={u} />)}
		</>
	);
};

const glass = 'rgba(0,0,0,0.62)';

const Rec = ({ u }: { u: number }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const secs = Math.floor(frame / fps);
	const on = frame % Math.round(fps * 1.3) < fps * 0.8;
	return (
		<div
			style={{
				position: 'absolute',
				left: 2.4 * u,
				top: 2.4 * u,
				display: 'flex',
				alignItems: 'center',
				gap: 0.7 * u,
				padding: `${0.65 * u}px ${1.2 * u}px`,
				borderRadius: 999,
				background: glass,
				backdropFilter: `blur(${u}px)`,
				color: 'rgba(255,255,255,0.92)',
				fontSize: 1.05 * u,
				fontWeight: 600,
				letterSpacing: '0.04em'
			}}
		>
			<span style={{ width: 0.75 * u, height: 0.75 * u, borderRadius: 999, background: '#ff453a', opacity: on ? 1 : 0.25 }} />
			REC
			<span style={{ fontWeight: 500, color: 'rgba(255,255,255,0.6)', fontVariantNumeric: 'tabular-nums' }}>
				{String(Math.floor(secs / 60)).padStart(2, '0')}:{String(secs % 60).padStart(2, '0')}
			</span>
		</div>
	);
};

const ToastPill = ({ t, u }: { t: { from: number; to: number; text: string }; u: number }) => {
	const frame = useCurrentFrame();
	if (frame < t.from || frame > t.to) return null;
	const inP = EASE.snap(interpolate(frame, [t.from, t.from + 14], [0, 1], clamp));
	const outP = interpolate(frame, [t.to - 12, t.to], [0, 1], clamp);
	return (
		<div
			style={{
				position: 'absolute',
				left: '50%',
				top: 2.4 * u,
				display: 'flex',
				alignItems: 'center',
				gap: 0.8 * u,
				padding: `${0.8 * u}px ${1.5 * u}px ${0.8 * u}px ${0.8 * u}px`,
				borderRadius: 999,
				background: 'rgba(18,19,24,0.94)',
				boxShadow: `0 0 0 1px rgba(255,255,255,0.12), 0 ${1.2 * u}px ${3 * u}px rgba(0,0,0,0.45)`,
				color: '#fff',
				fontSize: 1.25 * u,
				fontWeight: 500,
				whiteSpace: 'nowrap',
				opacity: inP * (1 - outP),
				transform: `translate(-50%, ${(1 - inP) * -120 + outP * -40}%)`
			}}
		>
			<span
				style={{
					display: 'grid',
					placeItems: 'center',
					width: 2 * u,
					height: 2 * u,
					borderRadius: 999,
					background: '#30d158',
					color: '#04210f',
					fontSize: 1.05 * u,
					fontWeight: 700
				}}
			>
				✓
			</span>
			{t.text}
		</div>
	);
};

/** One cap per key, pressed (lighter, lower) while held, then released. */
const Keycaps = ({ k, u }: { k: { at: number; keys: string[]; hold?: number }; u: number }) => {
	const frame = useCurrentFrame();
	const hold = k.hold ?? 24;
	const end = k.at + hold + 22;
	if (frame < k.at || frame > end) return null;
	const appear = EASE.snap(interpolate(frame, [k.at, k.at + 8], [0, 1], clamp));
	const pressed = frame < k.at + hold;
	const gone = interpolate(frame, [end - 12, end], [1, 0], clamp);
	return (
		<div
			style={{
				position: 'absolute',
				left: '50%',
				bottom: 12 * u,
				display: 'flex',
				gap: 0.7 * u,
				opacity: appear * gone,
				transform: `translate(-50%, ${pressed ? 0.3 * u : 0}px) scale(${0.86 + 0.14 * appear})`
			}}
		>
			{k.keys.map((key, i) => (
				<div
					key={i}
					style={{
						display: 'grid',
						placeItems: 'center',
						minWidth: 5.5 * u,
						height: 5.5 * u,
						padding: `0 ${1.2 * u}px`,
						boxSizing: 'border-box',
						borderRadius: 1.3 * u,
						background: pressed ? 'rgba(60,60,64,0.92)' : 'rgba(0,0,0,0.82)',
						border: '1px solid rgba(255,255,255,0.22)',
						boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14)',
						color: '#fff',
						fontSize: 2.3 * u,
						fontWeight: 500
					}}
				>
					{key}
				</div>
			))}
		</div>
	);
};

/** Caption line; words light up one by one across the first 60% of its time. */
const CaptionLine = ({ c, u }: { c: { from: number; to: number; text: string }; u: number }) => {
	const frame = useCurrentFrame();
	if (frame < c.from || frame > c.to) return null;
	const words = c.text.split(' ');
	const inP = EASE.snap(interpolate(frame, [c.from, c.from + 12], [0, 1], clamp));
	const out = interpolate(frame, [c.to - 10, c.to], [1, 0], clamp);
	const span = (c.to - c.from) * 0.6;
	return (
		<div
			style={{
				position: 'absolute',
				left: '50%',
				bottom: 3.2 * u,
				display: 'flex',
				gap: '0.32em',
				padding: `${0.95 * u}px ${1.9 * u}px`,
				borderRadius: 1.2 * u,
				background: 'rgba(0,0,0,0.68)',
				backdropFilter: `blur(${1.2 * u}px)`,
				fontSize: 2.1 * u,
				fontWeight: 600,
				letterSpacing: '-0.01em',
				whiteSpace: 'nowrap',
				opacity: inP * out,
				transform: `translate(-50%, ${(1 - inP) * 0.6 * u}px)`
			}}
		>
			{words.map((w, i) => {
				const at = c.from + (span * i) / words.length;
				const color = frame < at ? 'rgba(255,255,255,0.32)' : frame < at + 8 ? '#74b4ff' : '#fff';
				return (
					<span key={i} style={{ color }}>
						{w}
					</span>
				);
			})}
		</div>
	);
};
