import * as THREE from 'three';
import { ChaosTrajectoryCreature } from './base/ChaosTrajectoryCreature';

const A = 5.0;
const B = -10.0;
const C = -0.38;

const chenLeeDeriv = (s: Float64Array, out: Float64Array): void => {
  out[0] = A * s[0] - s[1] * s[2];
  out[1] = B * s[1] + s[0] * s[2];
  out[2] = C * s[2] + (s[0] * s[1]) / 3;
};

export class ChenLeeAttractor extends ChaosTrajectoryCreature {
  public init(): void {
    this.buildChaosTracks(chenLeeDeriv, {
      seeds: [
        [1.2, 1.1, 0.9],
        [-1.2, -1.1, -0.9],
        [0.6, -1.4, 1.1],
        [-0.6, 1.4, -1.1],
      ],
      dt: 0.005,
      steps: 4000,
      discard: 600,
      swarmCount: 1100,
      swarmSpeed: 160,
      trackPointSize: 1.2,
      swarmPointSize: 2.8,
    });
  }

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    super.update(delta, elapsed, playerPos, playerVel);
    this.group.rotateY(delta * 0.18);
  }
}
