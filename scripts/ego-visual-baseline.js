/**
 * 生成 40 类模型截图。
 * 默认写 tests/visual-current（用于 compare:visual）；
 * 更新基线必须显式 `npm run update:visual`，避免静默覆写基准。
 */
const fsp = await import('node:fs/promises');
const path = await import('node:path');

const root = process.env.INIT_CWD || process.env.PWD || '.';
const updateFlag = path.join(root, 'tests/.visual-update');
const updateMode = await fsp.access(updateFlag).then(() => true, () => false);
const outDir = process.env.VISUAL_DIR
  ? path.resolve(root, process.env.VISUAL_DIR)
  : path.join(root, updateMode ? 'tests/visual-baseline' : 'tests/visual-current');
const baseUrl = process.env.COSMOS_URL || 'http://localhost:5173/';

await fsp.mkdir(outDir, { recursive: true });

const task = await taskSpace('cosmos-visual-baseline');
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
await page.waitForTimeout(18000);
for (let i = 0; i < 200; i++) {
  const done = await page.evaluate(() => window.__COSMOS__?.creatureSystem?.remaining === 0);
  if (done) break;
  await page.waitForTimeout(100);
}

const entries = await page.evaluate(() => {
  const c = window.__COSMOS__;
  // 冻结轨道与模型自转，确保取景后模型不会飞出画面
  c.creatureSystem.update = () => {};
  // 点云/线框在截图中放大，避免基线过暗难以审查
  for (const cr of c.creatures) {
    cr.group.traverse((o) => {
      if (o.isPoints && o.material?.uniforms?.uSize) {
        o.material.uniforms.uSize.value = Math.max(o.material.uniforms.uSize.value * 3, 4);
        for (const key of ['uCoreColor', 'uGlowColor', 'uAccentColor']) {
          const value = o.material.uniforms[key]?.value;
          if (value?.multiplyScalar) value.multiplyScalar(2.5);
        }
      } else if (o.isLineSegments && o.material) {
        o.material.opacity = Math.min(1, (o.material.opacity ?? 0.5) * 2);
        if (o.material.color?.multiplyScalar) o.material.color.multiplyScalar(2);
      }
    });
  }
  for (const id of ['hud', 'warp-selector', 'codex-drawer', 'callout-canvas', 'flight-status', 'crosshair']) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }
  c.dust.mesh.visible = false;
  c.leviathan.group.visible = false;
  const seen = new Set();
  const result = [];
  for (const cr of c.creatures) {
    if (seen.has(cr.config.modelType)) continue;
    seen.add(cr.config.modelType);
    result.push({ code: cr.config.code, type: cr.config.modelType });
  }
  return result.sort((a, b) => a.code.localeCompare(b.code));
});

const LOOSE_TOLERANCE = new Set(['hopf', 'fourier', 'harmonics']);
const KURAMOTO_TOLERANCE = { mean: 80, changed: 0.9 };

function toleranceFor(type) {
  if (type === 'kuramoto') return KURAMOTO_TOLERANCE;
  if (LOOSE_TOLERANCE.has(type)) return { mean: 70, changed: 0.6 };
  return undefined;
}

const manifest = [];
for (const entry of entries) {
  await page.evaluate(({ type }) => {
    const c = window.__COSMOS__;
    c.flight.detach();
    c.flight.target = null;
    const target = c.creatures.find((x) => x.config.modelType === type && x.ready);
    for (const cr of c.creatures) cr.group.visible = cr.config.modelType === type;
    c.leviathan.group.visible = false;
    c.dust.mesh.visible = false;
    target.setLOD(0);

    const world = target.group.position.clone().add(c.engine.universeRoot.position);
    const Vec3 = c.flight.position.constructor;
    const hasMesh = target.group.children.some((o) => o.isMesh && !o.isSprite);
    const zoom = hasMesh ? 2.4 : 1.6;
    const offset = new Vec3(0.55, 0.32, 1).normalize().multiplyScalar(target.config.scale * zoom);
    c.flight.position.copy(world).add(offset);
    c.flight.velocity.set(0, 0, 0);
    c.engine.camera.position.copy(c.flight.position);
    c.engine.camera.lookAt(world);
    c.flight.quaternion.copy(c.engine.camera.quaternion);
  }, entry);
  // 首次 LOD0 可能触发着色器编译；等编译完成后再按模型当前位置重新取景
  await page.waitForTimeout(2000);
  await page.evaluate(({ type }) => {
    const c = window.__COSMOS__;
    const target = c.creatures.find((x) => x.config.modelType === type && x.ready);
    target.setLOD(0);
    const world = target.group.position.clone().add(c.engine.universeRoot.position);
    const Vec3 = c.flight.position.constructor;
    const hasMesh = target.group.children.some((o) => o.isMesh && !o.isSprite);
    const zoom = hasMesh ? 2.4 : 1.6;
    const offset = new Vec3(0.55, 0.32, 1).normalize().multiplyScalar(target.config.scale * zoom);
    c.flight.position.copy(world).add(offset);
    c.flight.velocity.set(0, 0, 0);
    c.engine.camera.position.copy(c.flight.position);
    c.engine.camera.lookAt(world);
    c.flight.quaternion.copy(c.engine.camera.quaternion);
  }, entry);
  await page.waitForTimeout(220);
  const file = `${entry.code}-${entry.type}.png`;
  await page.screenshot({ path: path.join(outDir, file) });
  const tolerance = toleranceFor(entry.type);
  manifest.push({
    ...entry,
    file,
    ...(tolerance ? { tolerance } : {}),
  });
  process.stdout.write(`captured ${file}\n`);
}

await fsp.writeFile(
  path.join(outDir, 'manifest.json'),
  JSON.stringify({ capturedAt: new Date().toISOString(), count: manifest.length, entries: manifest }, null, 2),
);

const errors = await page.evaluate(() => (window.__ERR__ || []).slice(0, 10));
console.log(JSON.stringify({ outDir, count: manifest.length, errors }, null, 2));
await page.close();
if (errors.length) throw new Error('视觉基线捕获期间出现错误：' + errors.join(' | '));
