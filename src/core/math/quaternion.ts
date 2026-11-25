export type Quat = [number, number, number, number];

export function quaternionSquare(q: Quat): Quat {
  const [x, y, z, w] = q;
  return [x * x - (y * y + z * z + w * w), 2 * x * y, 2 * x * z, 2 * x * w];
}

/**
 * q ← q² + c 的距离估计；返回 DE 与逃逸前的迭代次数。
 * 三维切片初值取 (x,y,z,0)，与可视化着色器保持一致。
 */
export function quaternionJuliaDE(
  x: number,
  y: number,
  z: number,
  c: Quat,
  iterations = 10,
): number {
  let q: Quat = [x, y, z, 0];
  let dz = 1;
  let r = 0;
  for (let i = 0; i < iterations; i++) {
    r = Math.hypot(q[0], q[1], q[2], q[3]);
    dz = 2 * r * dz;
    const sq = quaternionSquare(q);
    q = [sq[0] + c[0], sq[1] + c[1], sq[2] + c[2], sq[3] + c[3]];
    if (q[0] * q[0] + q[1] * q[1] + q[2] * q[2] + q[3] * q[3] > 16) break;
  }
  r = Math.hypot(q[0], q[1], q[2], q[3]);
  return (0.5 * r * Math.log(Math.max(r, 1.0001))) / Math.max(dz, 1e-5);
}
