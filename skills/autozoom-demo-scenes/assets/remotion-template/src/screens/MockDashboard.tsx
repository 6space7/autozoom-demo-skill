import { useAfter, useProgress, useTyped } from '../lib/hooks';

/**
 * EXAMPLE SCREEN. In a real project, replace this with the product's own UI:
 * import its real components when they render without the app's runtime,
 * or rebuild the page from its source (same markup, classes, colours,
 * fonts, copy and realistic data). Draw it at the story viewport (1440 × 900).
 *
 * It animates itself from the frame numbers passed in `t`, so the timeline
 * stays in story.tsx. Positions the story aims at:
 *   search box   [272, 32, 420, 48]   centre (482, 56)
 *   Share button [1240, 32, 168, 48]  centre (1324, 56)
 *   chart card   [272, 294, 1144, 574] centre (844, 581)
 */
export type DashboardTimes = { focus: number; type: number; query: string; update: number; share: number };

const card = {
	position: 'absolute' as const,
	borderRadius: 14,
	background: 'rgba(255,255,255,0.03)',
	boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.07)',
	boxSizing: 'border-box' as const
};

const before = [42, 55, 48, 70, 62, 76, 88, 66, 58, 72, 50, 80];
const after = [64, 38, 82, 52, 30, 58, 96, 44, 70, 36, 62, 48];

export const MockDashboard = ({ t }: { t: DashboardTimes }) => {
	const focused = useAfter(t.focus, t.update);
	const typed = useTyped(t.type, t.query);
	const regions = useAfter(t.update);
	const grow = useProgress(t.update, t.update + 36, 'snap'); // bars re-shape after ↵
	const shared = useAfter(t.share);

	return (
		<div style={{ position: 'relative', width: 1440, height: 900, background: '#111113', color: '#ececee', fontFamily: 'Inter, -apple-system, system-ui, sans-serif' }}>
			{/* Sidebar */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					bottom: 0,
					width: 240,
					background: '#0d0d0f',
					borderRight: '1px solid rgba(255,255,255,0.06)',
					padding: '28px 18px',
					boxSizing: 'border-box'
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 17, fontWeight: 600, marginBottom: 26 }}>
					<span style={{ width: 28, height: 28, borderRadius: 8, background: '#fff', color: '#000', display: 'grid', placeItems: 'center', fontWeight: 700 }}>A</span>
					Acme
				</div>
				{['Overview', 'Reports', 'Customers', 'Settings'].map((n, i) => (
					<div
						key={n}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 12,
							padding: '9px 12px',
							borderRadius: 9,
							marginBottom: 4,
							fontSize: 15,
							color: i === 0 ? '#fff' : '#a1a1aa',
							background: i === 0 ? 'rgba(255,255,255,0.07)' : 'transparent'
						}}
					>
						<span style={{ width: 15, height: 15, borderRadius: 4, border: '2px solid currentColor', opacity: 0.7 }} />
						{n}
					</div>
				))}
			</div>

			{/* Search: the typed text goes into the real field. */}
			<div
				style={{
					...card,
					left: 272,
					top: 32,
					width: 420,
					height: 48,
					borderRadius: 12,
					background: '#17171a',
					boxShadow: focused ? 'inset 0 0 0 1px #2f7bf6, 0 0 0 4px rgba(47,123,246,0.25)' : card.boxShadow,
					display: 'flex',
					alignItems: 'center',
					gap: 10,
					padding: '0 16px',
					fontSize: 15
				}}
			>
				<svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="#5c5c63" strokeWidth={2.4} strokeLinecap="round">
					<circle cx="11" cy="11" r="7" />
					<path d="M20 20l-3.5-3.5" />
				</svg>
				{typed.started ? (
					<span style={{ color: '#fff', display: 'flex', alignItems: 'center' }}>
						{typed.value}
						{focused && <span style={{ width: 2, height: 18, marginLeft: 1, background: '#2f7bf6', opacity: typed.caret ? 1 : 0 }} />}
					</span>
				) : (
					<span style={{ color: '#5c5c63', display: 'flex', alignItems: 'center' }}>
						{focused && <span style={{ width: 2, height: 18, marginRight: 1, background: '#2f7bf6' }} />}
						Search metrics
					</span>
				)}
			</div>

			<div style={{ ...card, left: 1020, top: 32, width: 200, height: 48, borderRadius: 12, display: 'grid', placeItems: 'center', fontSize: 15, color: '#a1a1aa' }}>
				Last 30 days
			</div>

			<div
				style={{
					position: 'absolute',
					left: 1240,
					top: 32,
					width: 168,
					height: 48,
					borderRadius: 999,
					display: 'grid',
					placeItems: 'center',
					fontSize: 15,
					fontWeight: 600,
					background: shared ? '#30d158' : '#fff',
					color: shared ? '#032611' : '#000'
				}}
			>
				{shared ? '✓ Link copied' : 'Share'}
			</div>

			{/* KPIs */}
			{[
				['Revenue', '$48.2k', '+12.4%'],
				['Active users', '3,914', '+6.1%'],
				['Conversion', '4.8%', '+0.6%']
			].map(([label, value, delta], i) => (
				<div key={label} style={{ ...card, left: 272 + i * 392, top: 112, width: 360, height: 150, padding: '22px 24px' }}>
					<div style={{ fontSize: 14, color: '#8a8a91' }}>{label}</div>
					<div style={{ marginTop: 12, fontSize: 38, fontWeight: 600, letterSpacing: '-0.02em', color: '#fff' }}>{value}</div>
					<div style={{ marginTop: 4, fontSize: 13, color: '#30d158' }}>{delta}</div>
				</div>
			))}

			{/* Chart: bars morph to the new query's data. */}
			<div style={{ ...card, left: 272, top: 294, width: 1144, height: 574, padding: '24px 26px' }}>
				<div style={{ fontSize: 17, fontWeight: 600, color: '#fff' }}>{regions ? t.query : 'Revenue · last 30 days'}</div>
				<div style={{ position: 'absolute', left: 26, right: 26, top: 74, bottom: 26, display: 'flex', alignItems: 'flex-end', gap: 18 }}>
					{before.map((h, i) => (
						<div
							key={i}
							style={{
								flex: 1,
								height: `${h + (after[i] - h) * grow}%`,
								borderRadius: '6px 6px 2px 2px',
								background: i === 6 ? '#2f7bf6' : 'rgba(255,255,255,0.1)'
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
};
