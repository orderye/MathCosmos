/**
 * Phase 5 性能门禁：
 * - 真实帧 EMA 分项（window.__PERF__）用于观测；
 * - CPU 更新预算用 200 次批量均摊，避免 headless 单帧计时分辨率噪声。
 * 用法：先 npm run dev，再 npm run verify:perf
 */
const baseUrl = process.env.COSMOS_URL || 'http://localhost:5173/';
const task = await taskSpace('cosmos-perf-audit');
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
await page.waitForTimeout(1000);

const result = await page.evaluate(() => {
  const c = window.__COSMOS__;
  const ctx = c.context;
  const N = 200;
  const start = performance.now();
  for (let i = 0; i < N; i++) c.runner.update(ctx, 0.016, 100 + i * 0.016);
  const batchCpuMs = (performance.now() - start) / N;
  return {
    hasPerf: !!window.__PERF__,
    perf: window.__PERF__?.snapshot?.(),
    batchCpuMs: Math.round(batchCpuMs * 1000) / 1000,
    systems: c.runner.timing,
    initMs: Math.round(c.creatureSystem.initMs),
    initCpuMs: c.creatureSystem.initCpuMs,
    ready: c.creatures.filter((x) => x.ready).length,
    errors: (window.__ERR__ || []).slice(0, 10),
    errorCount: (window.__ERR__ || []).length,
  };
});

console.log(JSON.stringify(result, null, 2));

if (!result.hasPerf || !result.perf) throw new Error('window.__PERF__ 未初始化');
if (result.errors.length) throw new Error('运行时错误：' + result.errors.join(' | '));
if (result.ready !== 114) throw new Error('实体未全部就绪：' + result.ready);
if (result.initMs > 30000) throw new Error('初始化墙钟超时：' + result.initMs + 'ms');
if (result.initCpuMs > 4000) {
  throw new Error('初始化 CPU 超预算：' + result.initCpuMs + 'ms');
}
if (result.batchCpuMs > 1.5) {
  throw new Error('CPU 更新超预算：' + result.batchCpuMs + 'ms（200 次均摊）');
}
if (result.perf.drawCalls > 160) throw new Error('DrawCall 超预算：' + result.perf.drawCalls);
if (result.perf.triangles > 1200000) throw new Error('三角形超预算：' + result.perf.triangles);
await page.close();
