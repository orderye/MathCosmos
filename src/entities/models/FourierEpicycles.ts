import * as THREE from 'three';
import { BaseMathCreature } from '../BaseMathCreature';
import { createPointsMaterial } from './base/CreatureMaterialFactory';

const TRAIL_N = 400;
const AMPS = [1.0, 0.55, 0.3, 0.16];
const OMEGA = [1, -3, 7, -11];
const Z_AXIS = new THREE.Vector3(0, 0, 1);

export class FourierEpicycles extends BaseMathCreature {
  private rings!: THREE.InstancedMesh;
  private trail!: THREE.Points;
  private readonly ringGeo = new THREE.TorusGeometry(1, 0.022, 6, 48);
  private readonly trailGeo = new THREE.BufferGeometry();
  private readonly trailPos = new Float32Array(TRAIL_N * 3);
  private readonly trailAge = new Float32Array(TRAIL_N);
  private trailAttr!: THREE.BufferAttribute;
  private ageAttr!: THREE.BufferAttribute;
  private head = 0;
  private readonly angles = new Float64Array(4);
  private readonly tilts: THREE.Quaternion[] = [];
  private readonly spin = new THREE.Quaternion();
  private readonly q = new THREE.Quaternion();
  private readonly mat = new THREE.Matrix4();
  private readonly pos = new THREE.Vector3();
  private readonly vec = new THREE.Vector3();
  private readonly scaleV = new THREE.Vector3();
  private ringMat!: THREE.MeshBasicMaterial;
  private trailMat!: THREE.ShaderMaterial;

  public init(): void {
    for (let k = 0; k < 4; k++) {
      const tilt = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(Math.random() * 1.2 - 0.6, Math.random() * Math.PI, Math.random() * 1.2 - 0.6),
      );
      this.tilts.push(tilt);
    }

    this.ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(1.6, 1.15, 0.18),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.rings = new THREE.InstancedMesh(this.ringGeo, this.ringMat, 4);
    this.group.add(this.rings);

    for (let i = 0; i < TRAIL_N; i++) this.trailAge[i] = i / TRAIL_N;
    this.trailAttr = new THREE.BufferAttribute(this.trailPos, 3);
    this.ageAttr = new THREE.BufferAttribute(this.trailAge, 1);
    this.trailGeo.setAttribute('position', this.trailAttr);
    this.trailGeo.setAttribute('aSpeed', this.ageAttr);
    const phases = new Float32Array(TRAIL_N);
    for (let i = 0; i < TRAIL_N; i++) phases[i] = i / TRAIL_N;
    this.trailGeo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    this.trailMat = createPointsMaterial({
      uniforms: this.uniforms,
      size: 1.5,
      coreColor: '#22D3EE',
      glowColor: '#0E7490',
    });
    this.trail = new THREE.Points(this.trailGeo, this.trailMat);
    this.group.add(this.trail);
    this.resources.trackAll(this.ringGeo, this.trailGeo, this.ringMat, this.trailMat);
    this.addLodPart({ object: this.rings, instanceCount: [4, 4, 0] });
    this.addLodPart({ object: this.trail, drawRange: [TRAIL_N, 120, 0] });
    this.setLOD(0);
  }

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    super.update(delta, elapsed, playerPos, playerVel);

    this.pos.set(0, 0, 0);
    for (let k = 0; k < 4; k++) {
      this.angles[k] += OMEGA[k] * delta * 1.2;
      this.spin.setFromAxisAngle(Z_AXIS, this.angles[k]);
      this.q.copy(this.tilts[k]).multiply(this.spin);
      this.vec.set(AMPS[k], 0, 0).applyQuaternion(this.q);
      this.scaleV.setScalar(AMPS[k]);
      this.mat.compose(this.pos, this.q, this.scaleV);
      this.rings.setMatrixAt(k, this.mat);
      this.pos.add(this.vec);
    }
    this.rings.instanceMatrix.needsUpdate = true;

    // 尾迹循环缓冲：笔尖写入
    this.head = (this.head + 1) % TRAIL_N;
    this.trailPos[this.head * 3] = this.pos.x;
    this.trailPos[this.head * 3 + 1] = this.pos.y;
    this.trailPos[this.head * 3 + 2] = this.pos.z;
    for (let i = 0; i < TRAIL_N; i++) {
      this.trailAge[i] = ((TRAIL_N + i - this.head) % TRAIL_N) / TRAIL_N;
    }
    this.trailAttr.needsUpdate = true;
    this.ageAttr.needsUpdate = true;
  }
}