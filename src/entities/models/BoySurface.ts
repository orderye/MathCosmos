import * as THREE from 'three';
import { ParametricSurfaceCreature } from './base/ParametricSurfaceCreature';
import { parametricGeometry } from './base/geometry';

const S5 = Math.sqrt(5);

export class BoySurface extends ParametricSurfaceCreature {
  public init(): void {
    const geo = parametricGeometry(
      128,
      64,
      [0, Math.PI * 2],
      [0, 1],
      (theta, v, out) => {
        const r = 1 - (1 - v) * (1 - v);
        const r3 = r ** 3;
        const r5 = r ** 5;
        const r6 = r ** 6;
        const c1 = Math.cos(theta);
        const s1 = Math.sin(theta);
        const c3 = Math.cos(3 * theta);
        const s3 = Math.sin(3 * theta);
        const c5 = Math.cos(5 * theta);
        const s5 = Math.sin(5 * theta);
        const c6 = Math.cos(6 * theta);
        const s6 = Math.sin(6 * theta);

        const dRe = r6 * c6 + S5 * r3 * c3 - 1;
        const dIm = r6 * s6 + S5 * r3 * s3;
        const den = Math.max(dRe * dRe + dIm * dIm, 1e-6);

        const n1Re = r * c1 - r5 * c5;
        const n1Im = r * s1 - r5 * s5;
        const n2Re = r * c1 + r5 * c5;
        const n2Im = r * s1 + r5 * s5;
        const n3Re = 1 + r6 * c6;
        const n3Im = r6 * s6;

        const g1 = (-1.5 * (n1Im * dRe - n1Re * dIm)) / den;
        const g2 = (-1.5 * (n2Re * dRe + n2Im * dIm)) / den;
        const g3 = (n3Im * dRe - n3Re * dIm) / den - 0.5;
        const scale = 1 / Math.max(g1 * g1 + g2 * g2 + g3 * g3, 1e-6);
        out.set(g1 * scale, g2 * scale, g3 * scale + 0.5);
      },
      { normalizeTo: 1 },
    );
    this.createSurface(geo, {
      gridFreq: [26, 16],
      flowSpeed: 2.4,
      waveAmp: 0.012,
      waveFreq: 0.9,
      doubleSided: true,
    });
  }

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    super.update(delta, elapsed, playerPos, playerVel);
    this.group.rotateY(delta * 0.17);
  }
}
