import * as THREE from 'three';
import { BaseMathCreature } from '../BaseMathCreature';
import { createShaderMaterial } from './base/CreatureMaterialFactory';
import primeVert from '../../shaders/prime.vert?raw';
import primeFrag from '../../shaders/prime.frag?raw';

const N_TOTAL = 2500;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

function sieve(n: number): Uint8Array {
  const isPrime = new Uint8Array(n).fill(1);
  isPrime[0] = 0;
  isPrime[1] = 0;
  for (let i = 2; i * i < n; i++) {
    if (isPrime[i]) for (let j = i * i; j < n; j += i) isPrime[j] = 0;
  }
  return isPrime;
}

export class PrimePhyllotaxis extends BaseMathCreature {
  private mesh!: THREE.InstancedMesh;
  private readonly octGeo = new THREE.OctahedronGeometry(0.022, 0);
  private mat!: THREE.ShaderMaterial;

  public init(): void {
    const flags = sieve(N_TOTAL);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3(1, 1, 1);
    const indices = new Float32Array(N_TOTAL);
    const primes = new Float32Array(N_TOTAL);
    const parity = new Float32Array(N_TOTAL);

    this.mat = createShaderMaterial({
      vertexShader: primeVert,
      fragmentShader: primeFrag,
      uniforms: {
        uTime: this.uniforms.uTime,
        uSweep: { value: 0 },
        uPlayerPos: this.uniforms.uPlayerPos,
        uWakeRadius: this.uniforms.uWakeRadius,
        uTealColor: { value: new THREE.Color('#2DD4BF') },
        uYellowColor: { value: new THREE.Color('#FDE047') },
        uDimColor: { value: new THREE.Color('#1E293B') },
      },
      includeWake: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.mesh = new THREE.InstancedMesh(this.octGeo, this.mat, N_TOTAL);
    let primeSeq = 0;
    for (let n = 0; n < N_TOTAL; n++) {
      const r = 0.95 * Math.sqrt(n / N_TOTAL);
      const theta = n * GOLDEN;
      const y = 1.7 * ((2 * n) / N_TOTAL - 1);
      p.set(r * Math.cos(theta), y, r * Math.sin(theta));
      m.compose(p, q, s);
      this.mesh.setMatrixAt(n, m);
      indices[n] = n;
      primes[n] = flags[n];
      // 素数按出现序号交替青/黄（素数本身几乎全为奇数，n%2 会全黄）
      if (flags[n]) primeSeq++;
      parity[n] = primeSeq % 2;
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    this.octGeo.setAttribute('aIndex', new THREE.InstancedBufferAttribute(indices, 1));
    this.octGeo.setAttribute('aPrime', new THREE.InstancedBufferAttribute(primes, 1));
    this.octGeo.setAttribute('aParity', new THREE.InstancedBufferAttribute(parity, 1));
    this.group.add(this.mesh);
    this.resources.trackAll(this.octGeo, this.mat);
    this.addLodPart({ object: this.mesh, instanceCount: [N_TOTAL, 800, 0] });
    this.setLOD(0);
  }

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    super.update(delta, elapsed, playerPos, playerVel);
    this.mat.uniforms.uSweep.value = ((elapsed % 3) / 3) * (N_TOTAL + 200);
  }
}