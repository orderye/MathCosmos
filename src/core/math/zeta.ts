export interface ComplexValue {
  re: number;
  im: number;
  mag: number;
  arg: number;
}

/**
 * Dirichlet η 交错级数 + 1-2^(1-s) 归一化求 ζ(s)，适合临界带内快速可视化。
 * terms 越大越接近真实零点；默认 140 项对 t∈[10,50] 视觉足够。
 */
export function dirichletZeta(sigma: number, t: number, terms = 140): ComplexValue {
  let sumRe = 0;
  let sumIm = 0;
  for (let n = 1; n <= terms; n++) {
    const ln = Math.log(n);
    const mag = Math.exp(-sigma * ln);
    const phase = -t * ln;
    const sign = n % 2 === 1 ? 1 : -1;
    sumRe += sign * mag * Math.cos(phase);
    sumIm += sign * mag * Math.sin(phase);
  }
  const m2 = Math.exp((1 - sigma) * Math.LN2);
  const p2 = -t * Math.LN2;
  const denRe = 1 - m2 * Math.cos(p2);
  const denIm = -m2 * Math.sin(p2);
  const den = Math.max(denRe * denRe + denIm * denIm, 1e-12);
  const re = (sumRe * denRe + sumIm * denIm) / den;
  const im = (sumIm * denRe - sumRe * denIm) / den;
  return { re, im, mag: Math.hypot(re, im), arg: Math.atan2(im, re) };
}
