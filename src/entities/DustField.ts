import * as THREE from 'three';
import dustVert from '../shaders/dust.vert?raw';
import dustFrag from '../shaders/dust.frag?raw';

const COUNT = 15000;
const BOX = 4000;

export interface DustUniforms {
  uPlayerPos: THREE.IUniform<THREE.Vector3>;
  uPlayerVel: THREE.IUniform<THREE.Vector3>;
  uWorldOffset: THREE.IUniform<THREE.Vector3>;
  uTime: THREE.IUniform<number>;
  uViewportHeight: THREE.IUniform<number>;
  uDustColor: THREE.IUniform<THREE.Color>;
  [uniform: string]: THREE.IUniform;
}

export class DustField {
  readonly mesh: THREE.InstancedMesh;
  readonly uniforms: DustUniforms;

  private readonly geometry: THREE.BoxGeometry;
  private readonly material: THREE.ShaderMaterial;

  constructor() {
    // 单位细线段：z 向 [-0.5, 0.5]，实例矩阵赋予随机朝向与长度
    this.geometry = new THREE.BoxGeometry(0.16, 0.16, 1);

    this.uniforms = {
      uPlayerPos: { value: new THREE.Vector3() },
      uPlayerVel: { value: new THREE.Vector3() },
      uWorldOffset: { value: new THREE.Vector3() },
      uTime: { value: 0 },
      uViewportHeight: { value: 1080 },
      uDustColor: { value: new THREE.Color('#8a7fa8') },
    };

    this.material = new THREE.ShaderMaterial({
      vertexShader: dustVert,
      fragmentShader: dustFrag,
      uniforms: this.uniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, COUNT);
    this.mesh.frustumCulled = false;

    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const euler = new THREE.Euler();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    const seeds = new Float32Array(COUNT);
    const brights = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      p.set(
        (Math.random() - 0.5) * BOX,
        (Math.random() - 0.5) * BOX,
        (Math.random() - 0.5) * BOX,
      );
      euler.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
      q.setFromEuler(euler);
      s.set(1, 1, 3 + Math.random() * 10);
      m.compose(p, q, s);
      this.mesh.setMatrixAt(i, m);
      seeds[i] = Math.random();
      brights[i] = 0.12 + Math.random() * 0.28;
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    this.geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1));
    this.geometry.setAttribute('aBright', new THREE.InstancedBufferAttribute(brights, 1));
  }

  /** 每帧同步玩家逻辑坐标/速度与浮动原点偏移（调用方传入预分配向量） */
  sync(
    logicalPos: THREE.Vector3,
    velocity: THREE.Vector3,
    worldOffset: THREE.Vector3,
    elapsed: number,
    viewportHeight: number,
  ): void {
    this.uniforms.uPlayerPos.value.copy(logicalPos);
    this.uniforms.uPlayerVel.value.copy(velocity);
    this.uniforms.uWorldOffset.value.copy(worldOffset);
    this.uniforms.uTime.value = elapsed;
    this.uniforms.uViewportHeight.value = viewportHeight;
  }

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}