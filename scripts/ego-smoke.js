/**
 * EGO 浏览器冒烟门禁。
 * 用法：先 `npm run dev`，再 `npm run verify:ego`
 * 可选：COSMOS_URL=http://localhost:5173/app.html npm run verify:ego
 */
const baseUrl = process.env.COSMOS_URL || 'http://localhost:5173/app.html';
const task = await taskSpace('cosmos-smoke');
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

const result = await page.evaluate(() => {
  const c = window.__COSMOS__;
  const errors = (window.__ERR__ || []).slice(0, 10);
  if (!c) return { hasCosmos: false, errors };
  const codes = [...new Set(c.creatures.map((x) => x.config.code))].sort();
  const shells = { inner: 0, main: 0, outer: 0 };
  const orbitOctants = new Set();
  const spinOctants = new Set();
  const octant = (x, y, z) =>
    `${x >= 0 ? '+' : '-'}${y >= 0 ? '+' : '-'}${z >= 0 ? '+' : '-'}`;
  for (const creature of c.creatures) {
    const { orbit, rotationAxis } = creature.config;
    shells[orbit.layer]++;
    orbitOctants.add(octant(
      Math.sin(orbit.inclination) * Math.sin(orbit.node),
      Math.cos(orbit.inclination),
      Math.sin(orbit.inclination) * Math.cos(orbit.node),
    ));
    spinOctants.add(octant(rotationAxis.x, rotationAxis.y, rotationAxis.z));
  }
  const center = c.context.cosmosCenter;
  const leviathanRadius = Math.hypot(
    c.leviathan.group.position.x,
    c.leviathan.group.position.z,
  );
  const perType = new Map();
  const progressBuckets = new Set();
  for (const creature of c.creatures) {
    const type = creature.config.modelType;
    perType.set(type, (perType.get(type) ?? 0) + 1);
    progressBuckets.add(Math.round(creature.lifecycle.progress * 10));
  }
  const alive = c.creatures.filter((x) => x.alive).length;
  const perTypeMax = Math.max(...perType.values());
  let minSlotSpread = 3;
  for (const [type, count] of perType) {
    if (count !== 3) continue;
    const buckets = new Set(
      c.creatures
        .filter((x) => x.config.modelType === type)
        .map((x) => Math.round(x.lifecycle.progress * 20)),
    );
    minSlotSpread = Math.min(minSlotSpread, buckets.size);
  }
  for (const creature of c.creatures) creature.setLOD(1);
  const lod1 = c.creatures.every((x) => x.currentLOD === 1);
  for (const creature of c.creatures) creature.setLOD(2);
  const lod2 = c.creatures.every((x) => x.currentLOD === 2);
  for (const creature of c.creatures) creature.setLOD(0);
  return {
    hasCosmos: true,
    errors,
    creatures: c.creatures.length,
    ready: c.creatures.filter((x) => x.ready).length,
    remaining: c.creatureSystem.remaining,
    initMs: Math.round(c.creatureSystem.initMs),
    initCpuMs: c.creatureSystem.initCpuMs,
    hint: document.querySelector('.hint')?.textContent ?? '',
    uniqueTypes: new Set(c.creatures.map((x) => x.config.modelType)).size,
    codeCount: codes.length,
    firstCode: codes[0],
    lastCode: codes[codes.length - 1],
    shells,
    orbitOctants: orbitOctants.size,
    spinOctants: spinOctants.size,
    cosmosCenter: [center.x, center.y, center.z],
    leviathanRadius: Math.round(leviathanRadius),
    perTypeMax,
    alive,
    progressBuckets: progressBuckets.size,
    minSlotSpread,
    lod1,
    lod2,
    programs: c.engine.renderer.info.programs.length,
    drawCalls: c.engine.renderer.info.render.calls,
    triangles: Math.round(c.engine.renderer.info.render.triangles),
    runnerSystems: c.runner.names.length,
  };
});

console.log(JSON.stringify(result, null, 2));

if (!result.hasCosmos) throw new Error('__COSMOS__ 未初始化');
if (result.errors.length) throw new Error('运行时错误：' + result.errors.join(' | '));
if (result.creatures !== 120) throw new Error('实体数不是 120：' + result.creatures);
if (result.ready !== 120 || result.remaining !== 0) {
  throw new Error('分帧初始化未完成：' + result.ready + ' / remaining ' + result.remaining);
}
if (result.initMs <= 0 || result.initMs > 30000) {
  throw new Error('分帧初始化墙钟异常：' + result.initMs + 'ms');
}
if (result.initCpuMs > 4000) {
  throw new Error('分帧初始化 CPU 超预算：' + result.initCpuMs + 'ms');
}
if (!result.hint.includes('WASD')) throw new Error('加载完成后 HUD 未恢复控制提示：' + result.hint);
if (result.uniqueTypes !== 40) throw new Error('模型类型数不是 40：' + result.uniqueTypes);
if (result.codeCount !== 40 || result.firstCode !== 'M01' || result.lastCode !== 'M40') {
  throw new Error('编号覆盖异常：' + result.firstCode + '..' + result.lastCode + ' / ' + result.codeCount);
}
if (result.shells.inner !== 30 || result.shells.main !== 63 || result.shells.outer !== 27) {
  throw new Error('壳层计数异常：' + JSON.stringify(result.shells));
}
if (result.perTypeMax !== 3) {
  throw new Error('单类同时存在的实体数不是 3：' + result.perTypeMax);
}
if (result.alive < 90) throw new Error('存活实体过少：' + result.alive);
if (result.progressBuckets < 6) {
  throw new Error('生命周期进度未错开：' + result.progressBuckets + ' 档');
}
if (result.minSlotSpread < 2) {
  throw new Error('同类三槽位相位未错开：' + result.minSlotSpread + ' 档');
}
if (result.orbitOctants !== 8 || result.spinOctants !== 8) {
  throw new Error('6DoF 球面覆盖异常：' + result.orbitOctants + '/' + result.spinOctants);
}
if (result.cosmosCenter.some((v) => Math.abs(v) > 1e-6)) {
  throw new Error('公转中心不是固定原点：' + JSON.stringify(result.cosmosCenter));
}
if (result.leviathanRadius < 500 || result.leviathanRadius > 3400) {
  throw new Error('黎曼巨兽越出内外环：' + result.leviathanRadius);
}
if (!result.lod1 || !result.lod2) throw new Error('LOD 1/2 切换异常');
if (result.drawCalls > 160) throw new Error('DrawCall 超预算：' + result.drawCalls);
if (result.triangles > 1200000) throw new Error('三角形超预算：' + result.triangles);
if (result.runnerSystems !== 8) throw new Error('系统数不是 8：' + result.runnerSystems);

// UI → 图鉴 → 跃迁 → 伴飞链路（headless 后台降频时按状态轮询，不按墙钟）
await page.evaluate(() => {
  document.querySelectorAll('#warp-list .warp-item')[20].click();
});
let warp = null;
for (let i = 0; i < 40; i++) {
  await page.waitForTimeout(300);
  warp = await page.evaluate(() => ({
    state: window.__COSMOS__.flight.state,
    drawerTitle: document.querySelector('#codex-title')?.textContent ?? '',
    pickHandler: typeof window.__COSMOS__.flight.pickHandler,
    errors: (window.__ERR__ || []).length,
  }));
  if (warp.state === 'ORBIT_LOCK') break;
}
console.log(JSON.stringify({ warp }, null, 2));
if (warp.state !== 'ORBIT_LOCK') throw new Error('跃迁未进入 ORBIT_LOCK：' + warp.state);
if (!warp.drawerTitle) throw new Error('图鉴未打开');
if (warp.pickHandler !== 'function') throw new Error('射线拾取未接线');
if (warp.errors !== 0) throw new Error('跃迁后出现运行时错误');
await page.close();
