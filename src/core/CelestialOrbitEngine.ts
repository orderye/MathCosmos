import * as THREE from 'three';

const TAU = Math.PI * 2;

/** 确定性种子随机源：工厂与实体重生共用，避免两套 PRNG 序列 */
export function createSeededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type OrbitLayer = 'inner' | 'main' | 'outer';

export interface OrbitalElements {
  layer: OrbitLayer;
  semiMajor: number;
  eccentricity: number;
  inclination: number;
  node: number;
  argPeri: number;
  meanAnomaly0: number;
  meanMotion: number;
  nodeRate: number;
  periRate: number;
  seed: number;
  driftScale: number;
}

interface LayerSpec {
  aMin: number;
  aMax: number;
  eMin: number;
  eMax: number;
  periodMin: number;
  periodMax: number;
  seedBase: number;
}

// 内环朝圣 / 中环洋流 / 外环深空（统一 500/1180/2350 口径）
const LAYERS: Record<OrbitLayer, LayerSpec> = {
  inner: {
    aMin: 500, aMax: 1150,
    eMin: 0.05, eMax: 0.18,
    periodMin: 40, periodMax: 70,
    seedBase: 0,
  },
  main: {
    aMin: 1180, aMax: 2300,
    eMin: 0.15, eMax: 0.35,
    periodMin: 90, periodMax: 180,
    seedBase: 1009,
  },
  outer: {
    aMin: 2350, aMax: 3400,
    eMin: 0.45, eMax: 0.75,
    periodMin: 240, periodMax: 420,
    seedBase: 2017,
  },
};

// 黄金比例/根号二小数序列：小样本也能均匀铺开球面方向与初始相位
const GOLDEN_FRACTION = 0.6180339887498949;
const IRRATIONAL_STEP = 0.7548776662466927;

const Y_AXIS = new THREE.Vector3(0, 1, 0);
const X_AXIS = new THREE.Vector3(1, 0, 0);
const qNode = new THREE.Quaternion();
const qIncl = new THREE.Quaternion();
const qArg = new THREE.Quaternion();
const planePos = new THREE.Vector3();
const planeVel = new THREE.Vector3();

export function createOrbitalElements(
  layer: OrbitLayer,
  rnd: () => number,
  index: number,
): OrbitalElements {
  const spec = LAYERS[layer];
  const period = spec.periodMin + rnd() * (spec.periodMax - spec.periodMin);
  // 球面均匀方向：法向 Y 分量按 2u-1 分层，升交点用无理数序列错开
  const inclinationPhase = (index * GOLDEN_FRACTION + rnd() * 0.055) % 1;
  const inclination = Math.acos(inclinationPhase * 2 - 1);
  const node = ((index * IRRATIONAL_STEP + rnd() * 0.09) % 1) * TAU;
  return {
    layer,
    semiMajor: spec.aMin + rnd() * (spec.aMax - spec.aMin),
    eccentricity: spec.eMin + rnd() * (spec.eMax - spec.eMin),
    inclination,
    node,
    argPeri: rnd() * TAU,
    meanAnomaly0: rnd() * TAU,
    meanMotion: TAU / period,
    // 长期进动：让轨道在数百秒后交织成花瓣状，而非机械闭合椭圆
    nodeRate: (rnd() - 0.5) * 0.01,
    periRate: (rnd() - 0.5) * 0.008,
    seed: spec.seedBase + index * 1.618034 + rnd() * 97.0,
    driftScale: 0.55 + rnd() * 0.45,
  };
}

/** 开普勒方程牛顿迭代：e ≤ 0.75 时 5 次即可收敛到视觉精度 */
function solveEccentricAnomaly(meanAnomaly: number, e: number): number {
  let eccentric = meanAnomaly;
  for (let i = 0; i < 5; i++) {
    const f = eccentric - e * Math.sin(eccentric) - meanAnomaly;
    eccentric -= f / (1 - e * Math.cos(eccentric));
  }
  return eccentric;
}

function hash3(x: number, y: number, z: number): number {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1440662683);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

/** 无分配三线性值噪声，替代 CPU 侧 snoise，供混沌漂移使用 */
function valueNoise3(x: number, y: number, z: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = smooth(x - xi);
  const yf = smooth(y - yi);
  const zf = smooth(z - zi);
  const c000 = hash3(xi, yi, zi);
  const c100 = hash3(xi + 1, yi, zi);
  const c010 = hash3(xi, yi + 1, zi);
  const c110 = hash3(xi + 1, yi + 1, zi);
  const c001 = hash3(xi, yi, zi + 1);
  const c101 = hash3(xi + 1, yi, zi + 1);
  const c011 = hash3(xi, yi + 1, zi + 1);
  const c111 = hash3(xi + 1, yi + 1, zi + 1);
  const x00 = c000 + (c100 - c000) * xf;
  const x10 = c010 + (c110 - c010) * xf;
  const x01 = c001 + (c101 - c001) * xf;
  const x11 = c011 + (c111 - c011) * xf;
  const y0 = x00 + (x10 - x00) * yf;
  const y1 = x01 + (x11 - x01) * yf;
  return (y0 + (y1 - y0) * zf) * 2 - 1;
}

/**
 * 以黎曼巨兽动态质心为原点的开普勒轨道解算。
 * 输出位置与单位切线；所有临时量模块级复用，渲染循环零 GC。
 */
export function sampleOrbit(
  elements: OrbitalElements,
  time: number,
  center: THREE.Vector3,
  outPosition: THREE.Vector3,
  outTangent: THREE.Vector3,
): void {
  const e = elements.eccentricity;
  const a = elements.semiMajor;
  const node = elements.node + elements.nodeRate * time;
  const argPeri = elements.argPeri + elements.periRate * time;
  const meanAnomaly = elements.meanAnomaly0 + elements.meanMotion * time;
  const eccentric = solveEccentricAnomaly(meanAnomaly, e);

  const cosE = Math.cos(eccentric);
  const sinE = Math.sin(eccentric);
  const radius = a * (1 - e * cosE);
  const trueAnomaly = Math.atan2(Math.sqrt(1 - e * e) * sinE, cosE - e);
  const cosNu = Math.cos(trueAnomaly);
  const sinNu = Math.sin(trueAnomaly);

  // 轨道平面取 XZ，法线为 +Y
  planePos.set(radius * cosNu, 0, radius * sinNu);
  const h = Math.sqrt(a * (1 - e * e));
  const vr = (e * Math.sin(trueAnomaly)) / h;
  const vt = h / radius;
  planeVel.set(vr * cosNu - vt * sinNu, 0, vr * sinNu + vt * cosNu);

  qNode.setFromAxisAngle(Y_AXIS, node);
  qIncl.setFromAxisAngle(X_AXIS, elements.inclination);
  qNode.multiply(qIncl);
  qArg.setFromAxisAngle(Y_AXIS, argPeri);
  qNode.multiply(qArg);

  planePos.applyQuaternion(qNode);
  planeVel.applyQuaternion(qNode);

  // 混沌生物微漂：缓慢值噪声，打破完美椭圆
  const drift = 35 * elements.driftScale;
  const nt = time * 0.1;
  const s = elements.seed;
  outPosition.set(
    center.x + planePos.x + valueNoise3(s * 0.71 + nt, s * 0.13, 0.37) * drift,
    center.y + planePos.y + valueNoise3(s * 0.29, s * 0.83 + nt, 1.61) * drift * 0.6,
    center.z + planePos.z + valueNoise3(s * 0.47, 0.91, s * 0.59 + nt) * drift,
  );
  outTangent.copy(planeVel).normalize();
}
