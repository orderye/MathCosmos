import * as THREE from 'three';
import { ParametricSurfaceCreature } from './base/ParametricSurfaceCreature';
import { parametricGeometry } from './base/geometry';

export class MobiusTwisted extends ParametricSurfaceCreature {
  public init(): void {
    const k = (this.config.params?.k as number) ?? 3;
    const geo = parametricGeometry(
      160,
      16,
      [0, Math.PI * 2],
      [-0.38, 0.38],
      (u, v, out) => {
        const twist = Math.cos((k * u) / 2);
        const radius = 1 + v * twist;
        out.set(radius * Math.cos(u), radius * Math.sin(u), v * Math.sin((k * u) / 2));
      },
      { normalizeTo: 1 },
    );
    this.createSurface(geo, {
      gridFreq: [30, 6],
      flowSpeed: 2.6,
      doubleSided: true,
      waveAmp: 0.006,
      waveFreq: 0.8,
    });
  }

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    super.update(delta, elapsed, playerPos, playerVel);
    this.group.rotateZ(delta * 0.2);
  }
}
