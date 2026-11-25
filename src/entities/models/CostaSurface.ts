import * as THREE from 'three';
import { ParametricSurfaceCreature } from './base/ParametricSurfaceCreature';
import { parametricGeometry } from './base/geometry';

/**
 * 科斯塔曲面的可视化近似：三个端、中央穿孔的三叶极小曲面光杯。
 * 完整 Weierstrass 椭圆函数数值网格在初始化期成本高且存在收敛边界，
 * 这里用保角三叶鞍形保持辨识度，后续可替换为精确网格。
 */
export class CostaSurface extends ParametricSurfaceCreature {
  public init(): void {
    const geo = parametricGeometry(
      120,
      72,
      [0, Math.PI * 2],
      [0.18, 1.2],
      (theta, r, out) => {
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        const y = 0.62 * Math.cos(3 * theta) * (1 - r / 1.2) ** 1.6;
        out.set(x, y, z);
      },
      { normalizeTo: 1, flipWinding: true },
    );
    this.createSurface(geo, {
      gridFreq: [24, 24],
      flowSpeed: 2.3,
      waveAmp: 0.01,
      waveFreq: 0.75,
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
    this.group.rotateY(delta * 0.18);
  }
}
