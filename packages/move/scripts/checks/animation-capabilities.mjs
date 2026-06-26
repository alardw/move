#!/usr/bin/env node
/**
 * Animation-capabilities check.
 *
 * The declarative `spec.animations` trigger/sequence system is the default way
 * to animate a component. Anything BEYOND it (imperative anime.js, the
 * sliding-indicator hook, …) is a sanctioned Tier-2 capability that MUST be
 * declared in `spec.animationCapabilities` — so imperative animation code is
 * never ad-hoc and every exception is visible in the spec.
 *
 * Fails when a component uses an imperative mechanism without declaring the
 * matching capability. Warns on migration candidates (e.g. an indicator still
 * driven by fn:'animatePosition' instead of the shared slidingIndicator hook)
 * and on stale declarations.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const COMPONENTS = join(dirname(fileURLToPath(import.meta.url)), '../../src/components');
const read = (f) => { try { return readFileSync(f, 'utf8'); } catch { return ''; } };

const dirs = [];
for (const cat of readdirSync(COMPONENTS)) {
  const catPath = join(COMPONENTS, cat);
  if (!statSync(catPath).isDirectory()) continue;
  for (const name of readdirSync(catPath)) {
    if (name === '_shared') continue;
    const d = join(catPath, name);
    if (statSync(d).isDirectory()) dirs.push({ name, dir: d });
  }
}

const ESCAPES = ['valueLoop', 'measureThenAnimate', 'scrollApi'];
let errors = 0;
let warnings = 0;
const out = [];

for (const { name, dir } of dirs.sort((a, b) => a.name.localeCompare(b.name))) {
  let src = '';
  for (const f of readdirSync(dir)) {
    if (!/\.(ts|tsx)$/.test(f) || /\.(test|spec)\./.test(f)) continue;
    src += read(join(dir, f)) + '\n';
  }
  const specSrc = read(join(dir, `${name}.spec.ts`));
  const capMatch = specSrc.match(/animationCapabilities:\s*\[([^\]]*)\]/);
  const declared = new Set(
    (capMatch ? capMatch[1].match(/'([a-zA-Z]+)'/g) ?? [] : []).map((s) => s.replace(/'/g, '')),
  );

  const usesHook = /\b(usePositionTracker|useSlidingIndicator)\s*\(/.test(src);
  const usesMoveAnimate = /\bmoveAnimate\s*\(/.test(src);
  const usesRawAnimate = /from ['"]animejs['"]/.test(src) && /\banimate\s*\(/.test(src);
  const usesAnimatePosition = /fn:\s*['"]animatePosition['"]/.test(src);

  const issues = [];

  if (usesHook && !declared.has('slidingIndicator'))
    issues.push(['error', "uses the sliding-indicator hook but spec.animationCapabilities lacks 'slidingIndicator'"]);

  if ((usesMoveAnimate || usesRawAnimate) && !ESCAPES.some((c) => declared.has(c)))
    issues.push([
      'error',
      `uses imperative anime.js (${usesMoveAnimate ? 'moveAnimate' : 'raw animate'}) but declares none of: ${ESCAPES.join(', ')}`,
    ]);

  if (usesAnimatePosition)
    issues.push([
      'warn',
      "drives an indicator with fn:'animatePosition' — migrate to the slidingIndicator capability (shared usePositionTracker hook) so every indicator uses one impl",
    ]);

  if (declared.has('slidingIndicator') && !usesHook && !usesAnimatePosition)
    issues.push(['warn', "declares 'slidingIndicator' but source uses neither the hook nor animatePosition"]);
  for (const c of ESCAPES)
    if (declared.has(c) && !usesMoveAnimate && !usesRawAnimate)
      issues.push(['warn', `declares '${c}' but source has no imperative anime.js`]);

  if (issues.length) {
    out.push(name);
    for (const [sev, msg] of issues) {
      out.push(`  ${sev === 'error' ? '✗' : '·'} ${msg}`);
      if (sev === 'error') errors++; else warnings++;
    }
  }
}

if (out.length) console.log(out.join('\n') + '\n');
console.log(`${dirs.length} components — ${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
