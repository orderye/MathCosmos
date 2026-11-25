import * as THREE from 'three';
import { BaseMathCreature } from '../../BaseMathCreature';
import { createPointsMaterial, createShaderMaterial } from './CreatureMaterialFactory';
import raymarchVert from '../../../shaders/mandelbulb.vert?raw';

export interface RaymarchOptions {
  deepColor?: string;
  tipColor?: string;
  haloColor?: string;
  pointCloud: Float32Array;
  pointSize?: number;
}

/** 模板 4：包围盒 Raymarching + LOD1 预采样点云基类（M22/M29） */
export abstract class RaymarchCreature extends BaseMathCreature {
  protected boxMesh!: THREE.Mesh;
  protected pointsMesh!: THREE.Points;
  protected readonly boxGeo = new THREE.BoxGeometry(2, 2, 2);
  protected readonly pointsGeo = new THREE.BufferGeometry();
  private readonly tmpV = new THREE.Vector3();
  private lastSide: THREE.Side = THREE.FrontSide;

  protected createRaymarch(fragShader: string, options: RaymarchOptions): void {
    const rayMat = createShaderMaterial({
      vertexShader: raymarchVert,
      fragmentShader: fragShader,
      glslVersion: THREE.GLSL3,
      uniforms: {
        uTime: this.uniforms.uTime,
        uDeepColor: { value: new THREE.Color(options.deepColor ?? this.config.glowColor) },
        uTipColor: { value: new THREE.Color(options.tipColor ?? this.config.coreColor) },
        uHaloColor: { value: new THREE.Color(options.haloColor ?? this.config.accentColor ?? this.config.glowColor) },
      },
      includeWake: false,
      transparent: true,
      depthWrite: true,
    });
    this.boxMesh = new THREE.Mesh(this.boxGeo, rayMat);
    this.group.add(this.boxMesh);
    this.resources.track(this.boxGeo);
    this.resources.track(rayMat);

    const pos = options.pointCloud;
    const count = pos.length / 3;
    const speed = new Float32Array(count);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      speed[i] = Math.min(1, Math.hypot(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]));
      phase[i] = (i * 0.618034) % 1;
    }
    this.pointsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.pointsGeo.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));
    this.pointsGeo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    const pointsMat = createPointsMaterial({
      uniforms: this.uniforms,
      size: options.pointSize ?? 1.6,
      coreColor: options.tipColor ?? this.config.coreColor,
      glowColor: options.deepColor ?? this.config.glowColor,
    });
    this.pointsMesh = new THREE.Points(this.pointsGeo, pointsMat);
    this.pointsMesh.visible = false;
    this.group.add(this.pointsMesh);
    this.resources.track(this.pointsGeo);
    this.resources.track(pointsMat);
    this.setLOD(0);
  }

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    super.update(delta, elapsed, playerPos, playerVel);
    this.group.updateWorldMatrix(true, false);
    this.tmpV.copy(playerPos);
    this.group.worldToLocal(this.tmpV);
    const inside = this.tmpV.length() < 1.05;
    const side = inside ? THREE.BackSide : THREE.FrontSide;
    if (side !== this.lastSide && this.boxMesh.visible) {
      (this.boxMesh.material as THREE.ShaderMaterial).side = side;
      this.lastSide = side;
    }
  }

  public setLOD(level: 0 | 1 | 2): void {
    this.currentLOD = level;
    this.boxMesh.visible = level === 0;
    this.pointsMesh.visible = level === 1;
    this.setSpriteVisible(level === 2);
    if (level === 0) this.lastSide = THREE.FrontSide;
  }
}
