export type Vec4 = [number, number, number, number];

/** 24-cell 顶点：4 维坐标中恰有两维取 ±1 的全部组合，共 24 个 */
export function cell24Vertices(): Vec4[] {
  const verts: Vec4[] = [];
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      for (const si of [-1, 1]) {
        for (const sj of [-1, 1]) {
          const p: Vec4 = [0, 0, 0, 0];
          p[i] = si;
          p[j] = sj;
          verts.push(p);
        }
      }
    }
  }
  return verts;
}

/** 24-cell 的 96 条棱：欧氏距离平方为 2 */
export function cell24Edges(verts = cell24Vertices()): Array<[number, number]> {
  const edges: Array<[number, number]> = [];
  for (let i = 0; i < verts.length; i++) {
    for (let j = i + 1; j < verts.length; j++) {
      let d = 0;
      for (let k = 0; k < 4; k++) d += (verts[i][k] - verts[j][k]) ** 2;
      if (Math.abs(d - 2) < 1e-6) edges.push([i, j]);
    }
  }
  return edges;
}

/** E8 的 240 个根：112 个整数根 + 128 个偶负号半整数根，统一除以 √2 归一化 */
export function e8Roots(): number[][] {
  const roots: number[][] = [];
  for (let i = 0; i < 8; i++) {
    for (let j = i + 1; j < 8; j++) {
      for (const si of [-1, 1]) {
        for (const sj of [-1, 1]) {
          const v = new Array(8).fill(0);
          v[i] = si;
          v[j] = sj;
          roots.push(v);
        }
      }
    }
  }
  for (let mask = 0; mask < 256; mask++) {
    let bits = 0;
    for (let b = 0; b < 8; b++) if (mask & (1 << b)) bits++;
    if (bits % 2 !== 0) continue;
    const v = new Array(8).fill(0.5);
    for (let b = 0; b < 8; b++) if (mask & (1 << b)) v[b] = -0.5;
    roots.push(v);
  }
  return roots.map((r) => r.map((x) => x / Math.SQRT2));
}

/** E8 的 6720 条对称边：归一化后内积为 1/2 */
export function e8Edges(roots = e8Roots()): Array<[number, number]> {
  const edges: Array<[number, number]> = [];
  for (let i = 0; i < roots.length; i++) {
    for (let j = i + 1; j < roots.length; j++) {
      let dot = 0;
      for (let k = 0; k < 8; k++) dot += roots[i][k] * roots[j][k];
      if (Math.abs(dot - 0.5) < 1e-6) edges.push([i, j]);
    }
  }
  return edges;
}
