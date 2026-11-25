import * as THREE from 'three';
import { ParametricSurfaceCreature } from './base/ParametricSurfaceCreature';
import { parametricGeometry } from './base/geometry';

const A = 1.0;
const B = 0.22;

export class DiniSurface extends ParametricSurfaceCreature {
  public init(): void {
    const geo = parametricGeometry(
      160,
      56,
      [0, Math.PI * 4],
      [0.06, 2.0],
      (u, v, out) => {
        out.set(
          A * Math.cos(u) * Math.sin(v),
          A * Math.sin(u) * Math.sin(v),
          A * (Math.cos(v) + Math.log(Math.tan(v / 2))) + B * u,
        );
      },
      { normalizeTo: 1, flipWinding: true },
    );
    this.createSurface(geo, {
      gridFreq: [10, 28],
      flowSpeed: 2.8,
      waveAmp: 0.008,
      waveFreq: 0.7,
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
    this.group.rotateY(delta * 0.2);
  }
}
