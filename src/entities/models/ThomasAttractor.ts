import * as THREE from 'three';
import { ChaosTrajectoryCreature } from './base/ChaosTrajectoryCreature';

const B = 0.208186;

const thomasDeriv = (s: Float64Array, out: Float64Array): void => {
  out[0] = Math.sin(s[1]) - B * s[0];
  out[1] = Math.sin(s[2]) - B * s[1];
  out[2] = Math.sin(s[0]) - B * s[2];
};

export class ThomasAttractor extends ChaosTrajectoryCreature {
  public init(): void {
    const seeds: number[][] = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const r = 0.8 + (i % 3) * 0.35;
      seeds.push([Math.cos(a) * r, Math.sin(a) * r, Math.sin(a * 2) * 0.8]);
    }
    this.buildChaosTracks(thomasDeriv, {
      seeds,
      dt: 0.08,
      steps: 1200,
      discard: 200,
      swarmCount: 900,
      swarmSpeed: 80,
      trackPointSize: 1.35,
      swarmPointSize: 2.4,
    });
  }

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    super.update(delta, elapsed, playerPos, playerVel);
    this.group.rotateY(delta * 0.12);
  }
}
