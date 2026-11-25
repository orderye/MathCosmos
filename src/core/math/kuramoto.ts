export interface OrderParameter {
  r: number;
  psi: number;
}

/** 序参量 R e^{iΨ} = (1/N) Σ e^{iθ_j} */
export function kuramotoOrder(phases: ArrayLike<number>): OrderParameter {
  const n = phases.length;
  if (n === 0) return { r: 0, psi: 0 };
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < n; i++) {
    cx += Math.cos(phases[i]);
    cy += Math.sin(phases[i]);
  }
  cx /= n;
  cy /= n;
  return { r: Math.hypot(cx, cy), psi: Math.atan2(cy, cx) };
}

/** 单步 O(N) 平均场更新；返回新的序参量供渲染或断言 */
export function kuramotoStep(
  phases: Float32Array,
  omegas: Float32Array,
  coupling: number,
  dt: number,
): OrderParameter {
  const order = kuramotoOrder(phases);
  const n = phases.length;
  for (let i = 0; i < n; i++) {
    phases[i] += (omegas[i] + coupling * order.r * Math.sin(order.psi - phases[i])) * dt;
  }
  return order;
}
