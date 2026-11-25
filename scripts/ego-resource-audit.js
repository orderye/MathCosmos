/**
 * Phase 4 资源释放审计：移除并 dispose 全部 114 个实体，
 * 断言 ResourceTracker 清空、GPU 几何/纹理回落到场景基线、0 错误。
 * 用法：先 npm run dev，再 npm run verify:resources
 */
const baseUrl = process.env.COSMOS_URL || 'http://localhost:5173/';
const task = await taskSpace('cosmos-resource-audit');
const page = (await task.pages())[0] ?? (await task.newPage());

await page.cdp('Page.addScriptToEvaluateOnNewDocument', {
  source: `window.__ERR__ = [];
    const orig = console.error.bind(console);
    console.error = (...args) => {
      window.__ERR__.push(args.map((a) => {
        try { return typeof a === 'string' ? a : JSON.stringify(a); } catch { return String(a); }
      }).join(' '));
      orig(...args);
    };
    window.addEventListener('error', (e) => window.__ERR__.push('window.error: ' + e.message));`,
});

await page.goto(baseUrl + '?t=' + Date.now(), { timeout: 60000 });
await page.waitForTimeout(2000);
for (let i = 0; i < 200; i++) {
  const done = await page.evaluate(() => window.__COSMOS__?.creatureSystem?.remaining === 0);
  if (done) break;
  await page.waitForTimeout(300);
}

const before = await page.evaluate(() => {
  const c = window.__COSMOS__;
  const missing = c.creatures.filter((x) => (x.resources?.resources?.length ?? 0) === 0).length;
  return {
    ready: c.creatures.filter((x) => x.ready).length,
    resourcesMissing: missing,
    memory: {
      geometries: c.engine.renderer.info.memory.geometries,
      textures: c.engine.renderer.info.memory.textures,
    },
  };
});

const disposed = await page.evaluate(() => {
  const c = window.__COSMOS__;
  for (const creature of c.creatures) {
    creature.group.removeFromParent();
    creature.dispose();
  }
  return {
    leftovers: c.creatures.reduce((n, x) => n + (x.resources?.resources?.length ?? 0), 0),
  };
});

await page.waitForTimeout(1500);
const after = await page.evaluate(() => {
  const c = window.__COSMOS__;
  return {
    memory: {
      geometries: c.engine.renderer.info.memory.geometries,
      textures: c.engine.renderer.info.memory.textures,
    },
    errors: (window.__ERR__ || []).slice(0, 10),
  };
});

console.log(JSON.stringify({ before, disposed, after }, null, 2));

if (before.ready !== 114) throw new Error('实体未全部就绪：' + before.ready);
if (before.resourcesMissing !== 0) throw new Error('资源登记缺失：' + before.resourcesMissing);
if (disposed.leftovers !== 0) throw new Error('dispose 后仍有登记资源：' + disposed.leftovers);
if (after.errors.length) throw new Error('释放后运行时错误：' + after.errors.join(' | '));
if (after.memory.geometries >= before.memory.geometries * 0.5) {
  throw new Error('几何未回落：' + before.memory.geometries + ' → ' + after.memory.geometries);
}
if (after.memory.textures > before.memory.textures) {
  throw new Error('纹理内存增长：' + before.memory.textures + ' → ' + after.memory.textures);
}
await page.close();
