export type QuantumState = [number, number, number];

export const HYDROGEN_STATES: QuantumState[] = [
  [3, 2, 0],
  [4, 2, 1],
  [4, 3, 2],
  [5, 3, 1],
];

/** 径向部分（省略归一化常数，只保留形状） */
export function hydrogenRadial(n: number, l: number, rho: number): number {
  if (n === 3 && l === 2) return rho * rho * Math.exp(-rho / 2);
  if (n === 4 && l === 2) return rho * rho * Math.exp(-rho / 2) * (6 - rho);
  if (n === 4 && l === 3) return rho ** 3 * Math.exp(-rho / 2);
  if (n === 5 && l === 3) return rho ** 3 * Math.exp(-rho / 2) * (8 - rho);
  return rho ** l * Math.exp(-rho / 2);
}

/** 实球谐部分（仅覆盖本图鉴使用的四个态） */
export function hydrogenAngular(l: number, m: number, theta: number, phi: number): number {
  const ct = Math.cos(theta);
  const st = Math.sin(theta);
  if (l === 2 && m === 0) return 0.315391565 * (3 * ct * ct - 1);
  if (l === 2 && m === 1) return -0.772548404 * st * ct * Math.cos(phi);
  if (l === 3 && m === 2) return 0.546274215 * st * st * Math.cos(2 * phi);
  if (l === 3 && m === 1) return -0.323180184 * st * (5 * ct * ct - 1) * Math.cos(phi);
  return 0;
}

export function hydrogenDensity(
  state: QuantumState,
  r: number,
  theta: number,
  phi: number,
): number {
  const [n, l, m] = state;
  const rho = (2 * r) / n;
  const psi = hydrogenRadial(n, l, rho) * hydrogenAngular(l, m, theta, phi);
  return psi * psi;
}

export function hydrogenSign(
  state: QuantumState,
  r: number,
  theta: number,
  phi: number,
): number {
  const [n, l, m] = state;
  const psi = hydrogenRadial(n, l, (2 * r) / n) * hydrogenAngular(l, m, theta, phi);
  return psi >= 0 ? 1 : -1;
}
