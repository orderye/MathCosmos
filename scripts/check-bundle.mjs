import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const budget = JSON.parse(readFileSync('tests/perf-budget.json', 'utf8')).bundle;
const html = readFileSync(join(dist, 'index.html'), 'utf8');
const match = html.match(/<script[^>]+src="([^"]+\.js)"/);
if (!match) {
  console.error('check-bundle: 未在 dist/index.html 找到入口脚本');
  process.exit(1);
}

const entry = match[1].replace(/^\//, '');
const entrySize = statSync(join(dist, entry)).size;
const jsDir = join(dist, 'assets');
const jsFiles = readdirSync(jsDir).filter((f) => f.endsWith('.js'));
const totalSize = jsFiles.reduce((sum, f) => sum + statSync(join(jsDir, f)).size, 0);

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
console.log(`entry: ${entry} (${kb(entrySize)})`);
console.log(`total JS: ${jsFiles.length} files (${kb(totalSize)})`);
console.log(`budget: entry ≤ ${kb(budget.entryJsMaxBytes)}, total ≤ ${kb(budget.totalJsMaxBytes)}`);

if (entrySize > budget.entryJsMaxBytes) {
  console.error(`check-bundle: 入口超过预算 ${kb(entrySize)} > ${kb(budget.entryJsMaxBytes)}`);
  process.exit(1);
}
if (totalSize > budget.totalJsMaxBytes) {
  console.error(`check-bundle: 总 JS 超过预算 ${kb(totalSize)} > ${kb(budget.totalJsMaxBytes)}`);
  process.exit(1);
}
