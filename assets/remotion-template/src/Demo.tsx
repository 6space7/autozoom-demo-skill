import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { story } from './story';
import { cameraAt, layout } from './lib/motion';
import { Window } from './components/Window';
import { ScreenLayer } from './components/ScreenLayer';
import { Overlays } from './components/Overlays';

// Overlay + chrome font. Screens should use the product's own font (see SKILL.md).
export const FONT = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

function wallpaperCss(w = 'wallpaper.jpg') {
	if (/[(#]/.test(w)) return w;
	return `url(${staticFile(w)}) center 62% / cover, #0b1030`;
}

/**
 * The whole demo: a desktop with the app window, filmed by the auto-zoom
 * camera (screen, cursor and spotlights zoom together, like a real
 * recording), plus overlays an editor adds on export (captions, keycaps,
 * toast, REC) that stay put.
 */
export const Demo = () => {
	const frame = useCurrentFrame();
	const { width: W, height: H } = useVideoConfig();
	const [vw, vh] = story.viewport;
	const lay = layout(W, H, vw, vh);
	const cam = cameraAt(story.camera, frame, W, H, lay, vw, vh);
	const wall = wallpaperCss(story.wallpaper);

	return (
		<AbsoluteFill style={{ background: wall, fontFamily: FONT, overflow: 'hidden' }}>
			<AbsoluteFill style={{ transformOrigin: '0 0', transform: `translate(${cam.tx}px, ${cam.ty}px) scale(${cam.s})` }}>
				<AbsoluteFill style={{ background: wall }} />
				<Window lay={lay} chrome={story.chrome} title={story.title} url={story.url}>
					<ScreenLayer lay={lay} />
				</Window>
			</AbsoluteFill>
			<Overlays />
		</AbsoluteFill>
	);
};
