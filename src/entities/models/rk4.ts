export type DerivFn = (s: Float64Array, out: Float64Array) => void;

/** RK4 积分采样：丢弃 discard 步暂态后返回 n 个 dim 维采样点（扁平数组） */
export function rk4Sample(
  dim: number,
  f: DerivFn,
  start: number[],
  dt: number,
  n: number,
  discard: number,
): Float64Array {
  const s = new Float64Array(dim);
  const k1 = new Float64Array(dim);
  const k2 = new Float64Array(dim);
  const k3 = new Float64Array(dim);
  const k4 = new Float64Array(dim);
  const tmp = new Float64Array(dim);
  for (let i = 0; i < dim; i++) s[i] = start[i];

  const step = (): void => {
    f(s, k1);
    for (let i = 0; i < dim; i++) tmp[i] = s[i] + (k1[i] * dt) / 2;
    f(tmp, k2);
    for (let i = 0; i < dim; i++) tmp[i] = s[i] + (k2[i] * dt) / 2;
    f(tmp, k3);
    for (let i = 0; i < dim; i++) tmp[i] = s[i] + k3[i] * dt;
    f(tmp, k4);
    for (let i = 0; i < dim; i++) s[i] += ((k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) * dt) / 6;
  };

  for (let i = 0; i < discard; i++) step();
  const out = new Float64Array(n * dim);
  for (let i = 0; i < n; i++) {
    for (let d = 0; d < dim; d++) out[i * dim + d] = s[d];
    step();
  }
  return out;
}

/** 将轨迹居中并缩放到单位半径 */
export function normalizeTrack(pts: Float64Array, dim: number): void {
  const center = new Float64Array(dim);
  const count = pts.length / dim;
  for (let d = 0; d < dim; d++) {
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < count; i++) {
      const v = pts[i * dim + d];
      if (v < min) min = v;
      if (v > max) max = v;
    }
    center[d] = (min + max) / 2;
  }
  let maxR = 0;
  for (let i = 0; i < count; i++) {
    let r = 0;
    for (let d = 0; d < dim; d++) {
      pts[i * dim + d] -= center[d];
      r += pts[i * dim + d] * pts[i * dim + d];
    }
    if (r > maxR) maxR = r;
  }
  const scale = 1 / Math.sqrt(maxR || 1);
  for (let i = 0; i < pts.length; i++) pts[i] *= scale;
}
