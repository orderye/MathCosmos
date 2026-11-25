import * as THREE from 'three';
import { ParametricSurfaceCreature } from './base/ParametricSurfaceCreature';
import { parametricGeometry } from './base/geometry';

export class EnneperSurface extends ParametricSurfaceCreature {
  public init(): void {
    const k = (this.config.params?.k as number) ?? 3;
    const order = 2 * k - 1;
    const geo = parametricGeometry(
      128,
      48,
      [0, Math.PI * 2],
      [0, 1.15],
      (theta, r, out) => {
        const rn = Math.pow(r, order);
        out.set(
          r * Math.cos(theta) - (rn / order) * Math.cos(order * theta),
          -r * Math.sin(theta) - (rn / order) * Math.sin(order * theta),
          (2 * Math.pow(r, k) * Math.cos(k * theta)) / k,
        );
      },
      { normalizeTo: 1, flipWinding: true },
    );
    this.createSurface(geo, {
      gridFreq: [20, 20],
      flowSpeed: 1.9,
      waveAmp: 0.035,
      waveFreq: 1.1,
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
    this.group.rotateZ(delta * 0.14);
  }
}
