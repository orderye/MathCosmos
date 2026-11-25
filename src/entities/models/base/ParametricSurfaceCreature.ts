import * as THREE from 'three';
import { SimpleMeshCreature } from './SimpleMeshCreature';
import { createSurfaceMaterial } from './CreatureMaterialFactory';

export interface SurfaceOptions {
  gridFreq?: [number, number];
  flowSpeed?: number;
  waveAmp?: number;
  waveFreq?: number;
  accentColor?: string;
  side?: THREE.Side;
  doubleSided?: boolean;
}

/** 模板 1：Fresnel + fwidth 抗锯齿网格 + 擦肩尾流的参数曲面基类 */
export abstract class ParametricSurfaceCreature extends SimpleMeshCreature {
  protected createSurface(geo: THREE.BufferGeometry, options: SurfaceOptions = {}): void {
    const mat = createSurfaceMaterial({
      uniforms: this.uniforms,
      accentColor: options.accentColor ?? this.config.accentColor ?? this.config.glowColor,
      gridFreq: options.gridFreq,
      flowSpeed: options.flowSpeed,
      waveAmp: options.waveAmp,
      waveFreq: options.waveFreq,
      side: options.side ?? (options.doubleSided ? THREE.DoubleSide : THREE.FrontSide),
    });
    this.attachMesh(geo, mat);
  }
}
