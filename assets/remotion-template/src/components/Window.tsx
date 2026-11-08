import type { ReactNode } from 'react';
import type { Lay } from '../lib/motion';

/** A macOS window around the screen: traffic lights, and a URL bar for websites. */
export const Window = ({
	lay,
	chrome,
	title,
	url,
	children
}: {
	lay: Lay;
	chrome: 'browser' | 'app';
	title?: string;
	url?: string;
	children: ReactNode;
}) => {
	const r = lay.bar * 0.45;
	const dot = lay.bar * 0.27;
	return (
		<div
			style={{
				position: 'absolute',
				left: lay.x,
				top: lay.y,
				width: lay.ww,
				height: lay.wh,
				borderRadius: r,
				overflow: 'hidden',
				background: '#111113',
				boxShadow: `0 0 0 1px rgba(255,255,255,0.12), 0 ${lay.bar * 0.9}px ${lay.bar * 2.4}px rgba(0,0,0,0.5)`
			}}
		>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 0,
					height: lay.bar,
					background: '#1b1b1e',
					borderBottom: '1px solid rgba(255,255,255,0.07)',
					display: 'flex',
					alignItems: 'center',
					padding: `0 ${lay.bar * 0.45}px`,
					gap: dot * 0.75
				}}
			>
				{['#ff5f57', '#febc2e', '#28c840'].map((c) => (
					<span key={c} style={{ width: dot, height: dot, borderRadius: 999, background: c }} />
				))}
				{chrome === 'browser' ? (
					<div
						style={{
							position: 'absolute',
							left: '50%',
							transform: 'translateX(-50%)',
							height: lay.bar * 0.62,
							minWidth: lay.ww * 0.34,
							padding: `0 ${lay.bar * 0.5}px`,
							borderRadius: lay.bar * 0.18,
							background: 'rgba(255,255,255,0.06)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: lay.bar * 0.18,
							color: 'rgba(255,255,255,0.6)',
							fontSize: lay.bar * 0.32
						}}
					>
						<svg width={lay.bar * 0.26} height={lay.bar * 0.26} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
							<rect x="5" y="11" width="14" height="10" rx="2" />
							<path d="M8 11V8a4 4 0 0 1 8 0v3" />
						</svg>
						{url ?? ''}
					</div>
				) : (
					<span
						style={{
							position: 'absolute',
							left: '50%',
							transform: 'translateX(-50%)',
							color: 'rgba(255,255,255,0.5)',
							fontSize: lay.bar * 0.33,
							fontWeight: 500
						}}
					>
						{title ?? ''}
					</span>
				)}
			</div>
			{children}
		</div>
	);
};
