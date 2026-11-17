import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const [mayor, menor] = pkg.version.split('.');

const git = (cmd) => {
  try { return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); }
  catch { return ''; }
};
// En Netlify existe COMMIT_REF; en tu ordenador se pregunta a git
const commit = (process.env.COMMIT_REF || git('git rev-parse HEAD') || 'dev').slice(0, 7);

writeFileSync('src/app/version.ts', // Generado por scripts/generar-version.mjs: no lo edites a mano.
`export const VERSION = {
  corta: 'v${mayor}.${menor}',
  completa: '${pkg.version}',
  commit: '${commit}',
  fecha: '${new Date().toISOString().slice(0, 10)}',
};
`);
console.log(`version.ts -> v${mayor}.${menor} (${commit})`);