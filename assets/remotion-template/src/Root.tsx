import { Composition } from 'remotion';
import { Demo } from './Demo';
import { story } from './story';

export const Root = () => (
	<Composition
		id="Demo"
		component={Demo}
		durationInFrames={story.durationInFrames}
		fps={story.fps}
		width={story.size?.[0] ?? 1920}
		height={story.size?.[1] ?? 1200}
	/>
);
