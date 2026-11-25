import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const budget = JSON.parse(readFileSync('tests/perf-budget.json', 'utf8')).bundle;
const jsDir = join(dist, 'assets');
const jsFiles = readdirSync(jsDir).filter((f) => f.endsWith('.js'));
const totalSize = jsFiles.reduce((sum, f) => sum + statSync(join(jsDir, f)).size, 0);

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

function checkEntry(htmlFile, label, maxBytes) {
  if (!existsSync(htmlFile)) {
    console.error(`check-bundle: 缺少 ${htmlFile}`);
    process.exit(1);
  }
  const html = readFileSync(htmlFile, 'utf8');
  const match = html.match(/<script[^>]+src="([^"]+\.js)"/);
  if (!match) {
    console.error(`check-bundle: 未在 ${htmlFile} 找到入口脚本`);
    process.exit(1);
  }
  const entry = match[1].replace(/^\//, '');
  const entrySize = statSync(join(dist, entry)).size;
  console.log(`${label} entry: ${entry} (${kb(entrySize)})`);
  if (entrySize > maxBytes) {
    console.error(
      `check-bundle: ${label} 入口超过预算 ${kb(entrySize)} > ${kb(maxBytes)}`,
    );
    process.exit(1);
  }
}

console.log(`total JS: ${jsFiles.length} files (${kb(totalSize)})`);
console.log(`budget: total ≤ ${kb(budget.totalJsMaxBytes)}`);
checkEntry(join(dist, 'app.html'), 'main', budget.entryJsMaxBytes);
checkEntry(join(dist, 'index.html'), 'landing', budget.landingEntryJsMaxBytes);

if (totalSize > budget.totalJsMaxBytes) {
  console.error(`check-bundle: 总 JS 超过预算 ${kb(totalSize)} > ${kb(budget.totalJsMaxBytes)}`);
  process.exit(1);
}
