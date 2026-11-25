export interface SoddyBall {
  b: number;
  cx: number;
  cy: number;
  cz: number;
}

const S6 = Math.sqrt(6);

function keyOf(b: number, cx: number, cy: number, cz: number): string {
  return `${b.toFixed(2)}|${cx.toFixed(2)}|${cy.toFixed(2)}|${cz.toFixed(2)}`;
}

/**
 * 三维 Soddy-Gosset 线性递推 BFS：4 个互相相切的单位球 + 外包球，
 * 逐层替换生成新的相切球，直到曲率上限或数量上限。
 */
export function buildApollonianPacking(
  maxCount = 520,
  maxCurvature = 26,
): SoddyBall[] {
  const invSqrt2 = 1 / Math.SQRT2;
  const balls: SoddyBall[] = [
    { b: 2 - S6, cx: 0, cy: 0, cz: 0 },
    { b: 1, cx: invSqrt2, cy: invSqrt2, cz: invSqrt2 },
    { b: 1, cx: invSqrt2, cy: -invSqrt2, cz: -invSqrt2 },
    { b: 1, cx: -invSqrt2, cy: invSqrt2, cz: -invSqrt2 },
    { b: 1, cx: -invSqrt2, cy: -invSqrt2, cz: invSqrt2 },
  ];
  const seen = new Set<string>();
  for (const s of balls) seen.add(keyOf(s.b, s.cx, s.cy, s.cz));

  const queue: number[][] = [[0, 1, 2, 3, 4]];
  while (queue.length && balls.length < maxCount) {
    const tuple = queue.shift()!;
    let sumB = 0;
    let sumBx = 0;
    let sumBy = 0;
    let sumBz = 0;
    for (const idx of tuple) {
      const s = balls[idx];
      sumB += s.b;
      sumBx += s.b * s.cx;
      sumBy += s.b * s.cy;
      sumBz += s.b * s.cz;
    }
    for (let k = 0; k < 5; k++) {
      const old = balls[tuple[k]];
      const b = sumB - old.b - old.b;
      if (b <= 0.02 || b > maxCurvature) continue;
      const bcx = sumBx - old.b * old.cx - old.b * old.cx;
      const bcy = sumBy - old.b * old.cy - old.b * old.cy;
      const bcz = sumBz - old.b * old.cz - old.b * old.cz;
      const cx = bcx / b;
      const cy = bcy / b;
      const cz = bcz / b;
      const key = keyOf(b, cx, cy, cz);
      if (seen.has(key)) continue;
      seen.add(key);
      balls.push({ b, cx, cy, cz });
      if (balls.length >= maxCount) break;
      const next = tuple.slice();
      next[k] = balls.length - 1;
      queue.push(next);
    }
  }
  return balls;
}
