#!/usr/bin/env node
/**
 * Add a Remotion demo project to the current project and install it.
 *
 *   node <skill>/scripts/setup.mjs [dir]        (default: ./demo)
 *
 * Copies the skill's template (camera, cursor, window, overlays, an example
 * screen and story) and runs npm install (Remotion + React). Safe to re-run:
 * an existing folder is kept and only re-installed.
 */
import { access, cp, writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const template = resolve(here, '../assets/remotion-template');
const dir = resolve(process.argv[2] ?? 'demo');
const exists = (p) => access(p).then(() => true, () => false);

if (await exists(resolve(dir, 'package.json'))) {
	console.log(`Using existing demo project in ${dir}`);
} else {
	await cp(template, dir, { recursive: true });
	await writeFile(resolve(dir, '.gitignore'), 'node_modules\nout\n');
	console.log(`Created ${dir}`);
}

console.log('Installing Remotion and React…');
execSync('npm install --no-audit --no-fund', { cwd: dir, stdio: 'inherit' });

console.log(`
Ready. Next:
  1. Build the screen in ${dir}/src/screens/ from the project's real UI code.
  2. Write the timeline in ${dir}/src/story.tsx.
  3. cd ${dir} && npm run studio      # live preview
     cd ${dir} && npm run render      # → out/demo.mp4`);
