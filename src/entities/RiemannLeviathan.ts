import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import {
  calloutAnchors,
  generateRiemannProofGraph,
  type CalloutAnchor,
  type RiemannProofGraphData,
} from '../data/riemannProofGraph';
import { RiemannRoamPath } from '../core/RiemannRoamPath';
import { LeviathanPilot } from '../core/flight/LeviathanPilot';
import simplexNoise from '../shaders/chunks/simplexNoise3D.glsl?raw';
import proximityWake from '../shaders/chunks/proximityWake.glsl?raw';
import leviathanWave from '../shaders/chunks/leviathanWave.glsl?raw';
import spineVert from '../shaders/riemannSpine.vert?raw';
import spineFrag from '../shaders/riemannSpine.frag?raw';
import branchVert from '../shaders/riemannBranch.vert?raw';
import branchFrag from '../shaders/riemannBranch.frag?raw';

const toV3 = (p: [number, number, number]): THREE.Vector3 => new THREE.Vector3(p[0], p[1], p[2]);

// 皇冠双峰搏动参数（规格 §3.2）
const BEAT_PERIOD = 3.6;
const SYSTOLIC_AT = 0.32;
const SYSTOLIC_SIGMA = 0.16;
const DIASTOLIC_AT = 1.15;
const DIASTOLIC_SIGMA = 0.3;

// 与 leviathanWave.glsl 保持一致，CPU 侧用于皇冠随动
const SPINE_WAVE_AMP = 75.0;
const SPINE_WAVE_OMEGA = 0.85;
const SPINE_WAVE_K = 3.5 * Math.PI;

function gaussianPulse(t: number, center: number, sigma: number): number {
  const d = t - center;
  return Math.exp(-(d * d) / (2 * sigma * sigma));
}

function bakeBranchAttributes(
  geo: THREE.BufferGeometry,
  hopStart: number,
  hopEnd: number,
  spineProgress: number,
  seed: number,
  tubeRadius: number,
): void {
  const uv = geo.getAttribute('uv');
  const count = uv.count;
  const hop = new Float32Array(count);
  const prog = new Float32Array(count);
  const seeds = new Float32Array(count);
  const radii = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    hop[i] = hopStart + (hopEnd - hopStart) * uv.getX(i);
    prog[i] = spineProgress;
    seeds[i] = seed;
    radii[i] = tubeRadius;
  }
  geo.setAttribute('aHopDistance', new THREE.BufferAttribute(hop, 1));
  geo.setAttribute('aSpineProgress', new THREE.BufferAttribute(prog, 1));
  geo.setAttribute('aBranchSeed', new THREE.BufferAttribute(seeds, 1));
  geo.setAttribute('aTubeRadius', new THREE.BufferAttribute(radii, 1));
}

export class RiemannLeviathan {
  readonly group = new THREE.Group();
  readonly data: RiemannProofGraphData;
  readonly anchors: CalloutAnchor[];
  /** 莫比乌斯导轨瞬时速度（宇宙根局部空间） */
  readonly velocity = new THREE.Vector3();
  /** 含浮动原点偏移的渲染空间质心 */
  readonly worldPosition = new THREE.Vector3();
  /** 当前威慑权重 0–1：玩家靠近时升高，驱动皇冠搏动与转头 */
  deterrence = 0;

  private readonly path = new RiemannRoamPath();
  private readonly pilot = new LeviathanPilot();
  private readonly materials: THREE.ShaderMaterial[] = [];
  private readonly geometries: THREE.BufferGeometry[] = [];
  private readonly disposables: Array<{ dispose(): void }> = [];
  private readonly sharedUniforms = {
    uLeviathanVel: { value: new THREE.Vector3() },
    uLeviathanPos: { value: new THREE.Vector3() },
    uSpineWaveAmp: { value: SPINE_WAVE_AMP },
    uSpineWaveOmega: { value: SPINE_WAVE_OMEGA },
    uSpineWaveK: { value: SPINE_WAVE_K },
    uDragCoeff: { value: 0.06 },
    // 神经动作电位与皇冠搏动同拍：每 3.6s 全株传导一次荧光脉冲
    uPulsePeriod: { value: BEAT_PERIOD },
  };

  private readonly crownMat: THREE.ShaderMaterial;
  private readonly crownCoreMat: THREE.MeshBasicMaterial;
  private readonly crownCoreBase = new THREE.Color(3.5, 3.2, 3.8);
  private readonly crownBase = new THREE.Vector3();
  private readonly crown: THREE.Mesh;
  private readonly crownCore: THREE.Mesh;

  constructor() {
    this.data = generateRiemannProofGraph();
    this.anchors = calloutAnchors(this.data);

    const spinePts = this.data.spinePoints.map(toV3);
    const spineCurve = new THREE.CatmullRomCurve3(spinePts, false, 'catmullrom', 0.5);

    const wakeUniforms = () => ({
      uPlayerPos: { value: new THREE.Vector3() },
      uPlayerVel: { value: new THREE.Vector3() },
      uWakeRadius: { value: 65 },
    });

    const spineMaterial = (core: THREE.Color, jitter: number, sheath: boolean): THREE.ShaderMaterial => {
      const mat = new THREE.ShaderMaterial({
        vertexShader: simplexNoise + proximityWake + leviathanWave + spineVert,
        fragmentShader: spineFrag,
        uniforms: {
          uTime: { value: 0 },
          uJitter: { value: jitter },
          uNoiseFreq: { value: 0.09 },
          uCoreColor: { value: core },
          uIsSheath: { value: sheath ? 1 : 0 },
          ...wakeUniforms(),
          ...this.sharedUniforms,
        },
        transparent: sheath,
        blending: sheath ? THREE.AdditiveBlending : THREE.NormalBlending,
        depthWrite: !sheath,
      });
      this.materials.push(mat);
      return mat;
    };

    // 双层脊柱：纯白内核 + 电弧外鞘
    const coreGeo = new THREE.TubeGeometry(spineCurve, 200, 3.4, 6, false);
    const sheathGeo = new THREE.TubeGeometry(spineCurve, 200, 6.5, 8, false);
    this.geometries.push(coreGeo, sheathGeo);
    this.group.add(new THREE.Mesh(coreGeo, spineMaterial(new THREE.Color(3.5, 3.2, 3.8), 2.2, false)));
    this.group.add(new THREE.Mesh(sheathGeo, spineMaterial(new THREE.Color(0.9, 0.4, 1.5), 1.8, true)));

    // 8 条缠绕白色细丝（合并单 Mesh）
    const filamentGeos: THREE.BufferGeometry[] = [];
    for (let j = 0; j < 8; j++) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < spinePts.length; i += 3) {
        const t = i / (spinePts.length - 1);
        const a = t * Math.PI * 12 + (j * Math.PI) / 4;
        const r = 6.0 + 1.0 * Math.sin(t * 40 + j * 1.7);
        pts.push(
          new THREE.Vector3(
            spinePts[i].x + Math.cos(a) * r,
            spinePts[i].y,
            spinePts[i].z + Math.sin(a) * r,
          ),
        );
      }
      filamentGeos.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 100, 0.3, 3, false));
    }
    const filamentGeo = mergeGeometries(filamentGeos)!;
    filamentGeos.forEach((g) => g.dispose());
    // 细丝也吃脊柱行波，否则会从波动的脊柱上剥离
    const filamentMat = new THREE.ShaderMaterial({
      vertexShader: leviathanWave + /* glsl */ `
        varying vec2 vUv;
        varying float vEnergy;
        void main() {
          vUv = uv;
          float s = clamp((position.y + 600.0) / 1200.0, 0.0, 1.0);
          vec3 local = position + leviathanSpineWave(s);
          vec4 world = modelMatrix * vec4(local, 1.0);
          vEnergy = s;
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        varying vec2 vUv;
        varying float vEnergy;
        void main() {
          float run = 0.65 + 0.35 * sin(vUv.x * 60.0 - uTime * 4.0 + vEnergy * 6.0);
          gl_FragColor = vec4(vec3(1.8, 1.7, 2.0) * run, 0.55 + 0.45 * run);
        }
      `,
      uniforms: { uTime: { value: 0 }, ...this.sharedUniforms },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.geometries.push(filamentGeo);
    this.materials.push(filamentMat);
    this.group.add(new THREE.Mesh(filamentGeo, filamentMat));

    // 引理分支：厚壁管与细神经纤维各自合并为单 Mesh
    const tubeGeos: THREE.BufferGeometry[] = [];
    const fiberGeos: THREE.BufferGeometry[] = [];
    let seq = 0;
    for (const edge of this.data.edges) {
      if (edge.edgeType !== 'branch_nerve') continue;
      const cp = edge.controlPoints.map(toV3);
      const curve = new THREE.CubicBezierCurve3(cp[0], cp[1], cp[2], cp[3]);
      const isFiber = edge.baseRadius < 1;
      const segs = isFiber ? 14 : edge.baseRadius >= 4 ? 8 : edge.baseRadius >= 2 ? 6 : 5;
      const geo = new THREE.TubeGeometry(curve, segs, isFiber ? 0.35 : edge.baseRadius, isFiber ? 3 : 4, false);
      bakeBranchAttributes(
        geo,
        edge.hopStart,
        edge.hopEnd,
        edge.spineProgress,
        (seq * 0.618034) % 1,
        isFiber ? 0.35 : edge.baseRadius,
      );
      seq++;
      (isFiber ? fiberGeos : tubeGeos).push(geo);
    }
    const branchMaterial = (mode: number, additive: boolean): THREE.ShaderMaterial => {
      const mat = new THREE.ShaderMaterial({
        vertexShader: proximityWake + leviathanWave + branchVert,
        fragmentShader: branchFrag,
        uniforms: {
          uTime: { value: 0 },
          uMode: { value: mode },
          ...wakeUniforms(),
          ...this.sharedUniforms,
        },
        transparent: additive,
        blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
        depthWrite: !additive,
      });
      this.materials.push(mat);
      return mat;
    };
    const tubesGeo = mergeGeometries(tubeGeos)!;
    const fibersGeo = mergeGeometries(fiberGeos)!;
    tubeGeos.forEach((g) => g.dispose());
    fiberGeos.forEach((g) => g.dispose());
    this.geometries.push(tubesGeo, fibersGeo);
    this.group.add(new THREE.Mesh(tubesGeo, branchMaterial(0, false)));
    this.group.add(new THREE.Mesh(fibersGeo, branchMaterial(1, true)));

    // 顶部皇冠光核：r22 半透明菲涅尔球 + 内部白热芯
    const crownGeo = new THREE.SphereGeometry(22, 32, 24);
    this.crownMat = new THREE.ShaderMaterial({
      vertexShader: /* glsl */ `
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vN = normalize(mat3(modelMatrix) * normal);
          vV = cameraPosition - wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uCrownPulse;
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.0);
          vec3 col = mix(vec3(0.75, 0.65, 1.0) * 0.9, vec3(1.5, 1.3, 1.9), f);
          col *= 1.0 + uCrownPulse * 1.3;
          gl_FragColor = vec4(col, 0.4 + 0.6 * f);
        }
      `,
      uniforms: { uCrownPulse: { value: 0 } },
      transparent: true,
      depthWrite: false,
    });
    const crownCoreGeo = new THREE.SphereGeometry(7, 16, 12);
    this.crownCoreMat = new THREE.MeshBasicMaterial({ color: this.crownCoreBase.clone() });
    const crownPos = spinePts[spinePts.length - 1];
    this.crownBase.copy(crownPos);
    this.crown = new THREE.Mesh(crownGeo, this.crownMat);
    this.crownCore = new THREE.Mesh(crownCoreGeo, this.crownCoreMat);
    this.crown.position.copy(crownPos);
    this.crownCore.position.copy(crownPos);
    this.geometries.push(crownGeo, crownCoreGeo);
    this.disposables.push(this.crownMat, this.crownCoreMat);
    this.group.add(this.crown, this.crownCore);

    // 首帧即落在内外环巡游起点，避免开场从原点弹射到巡游位置
    this.path.sample(0, this.group.position, this.velocity, this.group.quaternion);
  }

  /** 浮动原点重置后重算世界矩阵与渲染空间质心 */
  syncWorld(): void {
    this.group.getWorldPosition(this.worldPosition);
    (this.sharedUniforms.uLeviathanPos.value as THREE.Vector3).copy(this.worldPosition);
  }

  update(
    delta: number,
    elapsed: number,
    playerPosRender: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    this.deterrence = this.pilot.update(
      delta,
      elapsed,
      playerPosRender,
      this.group.position,
      this.velocity,
      this.group.quaternion,
    );
    this.syncWorld();
    (this.sharedUniforms.uLeviathanVel.value as THREE.Vector3).copy(this.velocity);

    for (const mat of this.materials) {
      mat.uniforms.uTime.value = elapsed;
      const playerPosUniform = mat.uniforms.uPlayerPos;
      const playerVelUniform = mat.uniforms.uPlayerVel;
      if (playerPosUniform) (playerPosUniform.value as THREE.Vector3).copy(playerPosRender);
      if (playerVelUniform) (playerVelUniform.value as THREE.Vector3).copy(playerVel);
    }

    this.updateCrown(elapsed);
  }

  private updateCrown(elapsed: number): void {
    const t = elapsed % BEAT_PERIOD;
    const beat =
      0.18 *
      (gaussianPulse(t, SYSTOLIC_AT, SYSTOLIC_SIGMA) +
        0.6 * gaussianPulse(t, DIASTOLIC_AT, DIASTOLIC_SIGMA));
    const strength = beat / 0.18 + this.deterrence * 0.9;

    // 皇冠是独立 Mesh，需要复算 s=1 处行波位移才能咬住脊柱顶端
    const wavePhase = SPINE_WAVE_OMEGA * elapsed - SPINE_WAVE_K;
    const envelope = 12.0 + SPINE_WAVE_AMP;
    const waveX = Math.sin(wavePhase) * envelope;
    const waveZ = Math.cos(wavePhase + Math.PI / 4) * envelope * 0.55;
    this.crown.position.set(this.crownBase.x + waveX, this.crownBase.y, this.crownBase.z + waveZ);
    this.crownCore.position.copy(this.crown.position);

    this.crown.scale.setScalar(1 + beat + this.deterrence * 0.25);
    this.crownCore.scale.setScalar(1 + 0.35 * strength);
    this.crownCoreMat.color.copy(this.crownCoreBase).multiplyScalar(1 + 1.06 * strength);
    (this.crownMat.uniforms.uCrownPulse.value as number) = strength;
  }

  dispose(): void {
    this.geometries.forEach((g) => g.dispose());
    this.materials.forEach((m) => m.dispose());
    this.disposables.forEach((d) => d.dispose());
  }
}
