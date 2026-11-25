import * as THREE from 'three';
import { BaseMathCreature } from '../../BaseMathCreature';
import { createShaderMaterial } from './CreatureMaterialFactory';
import instancedVert from '../../../shaders/instancedLattice.vert?raw';
import instancedFrag from '../../../shaders/instancedLattice.frag?raw';

export interface InstanceOptions {
  breathAmp?: number;
  coreColor?: string;
  glowColor?: string;
  accentColor?: string;
  transparent?: boolean;
  side?: THREE.Side;
  blending?: THREE.Blending;
}

/** InstancedMesh 共享几何 + aInstanceScalar / aPhase 的实例晶格基类 */
export abstract class InstancedLatticeCreature extends BaseMathCreature {
  protected instanceMesh!: THREE.InstancedMesh;
  protected instanceGeo: THREE.BufferGeometry | null = null;
  protected instanceMat: THREE.ShaderMaterial | null = null;
  protected scalarAttr: THREE.InstancedBufferAttribute | null = null;
  protected phaseAttr: THREE.InstancedBufferAttribute | null = null;
  protected instanceCountTotal = 0;

  protected createInstances(
    geo: THREE.BufferGeometry,
    matrices: THREE.Matrix4[],
    scalars: Float32Array,
    phases: Float32Array,
    options: InstanceOptions = {},
  ): void {
    this.instanceGeo = geo;
    this.instanceCountTotal = matrices.length;
    this.scalarAttr = new THREE.InstancedBufferAttribute(scalars, 1);
    this.phaseAttr = new THREE.InstancedBufferAttribute(phases, 1);
    geo.setAttribute('aInstanceScalar', this.scalarAttr);
    geo.setAttribute('aPhase', this.phaseAttr);

    this.instanceMat = createShaderMaterial({
      uniforms: {
        ...this.uniforms,
        uCoreColor: { value: new THREE.Color(options.coreColor ?? this.config.coreColor) },
        uGlowColor: { value: new THREE.Color(options.glowColor ?? this.config.glowColor) },
        uAccentColor: { value: new THREE.Color(options.accentColor ?? this.config.accentColor ?? this.config.glowColor) },
        uBreathAmp: { value: options.breathAmp ?? 0.12 },
      },
      vertexShader: instancedVert,
      fragmentShader: instancedFrag,
      includeWake: true,
      transparent: options.transparent ?? true,
      depthWrite: false,
      side: options.side ?? THREE.FrontSide,
      blending: options.blending ?? THREE.NormalBlending,
    });

    this.instanceMesh = new THREE.InstancedMesh(geo, this.instanceMat, matrices.length);
    for (let i = 0; i < matrices.length; i++) this.instanceMesh.setMatrixAt(i, matrices[i]);
    this.instanceMesh.instanceMatrix.needsUpdate = true;
    this.group.add(this.instanceMesh);
    this.resources.track(geo);
    this.resources.track(this.instanceMat);
    this.resources.track(this.instanceMesh);
    this.setLOD(0);
  }

  public setLOD(level: 0 | 1 | 2): void {
    this.currentLOD = level;
    if (!this.instanceMesh) return;
    this.instanceMesh.visible = level < 2;
    this.instanceMesh.count =
      level === 0 ? this.instanceCountTotal : level === 1 ? Math.max(1, Math.floor(this.instanceCountTotal / 3)) : 0;
    super.setLOD(level);
  }
}
