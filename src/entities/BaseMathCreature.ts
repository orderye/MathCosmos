import * as THREE from 'three';
import { sampleOrbit, type OrbitalElements } from '../core/CelestialOrbitEngine';
import { ResourceTracker } from '../core/ResourceTracker';
import type { AudioFamily, MathCategory, ModelParams } from '../data/modelTypes';
import { CreatureBehavior } from './behavior/CreatureBehavior';

export type { MathCategory } from '../data/modelTypes';

export interface MathCreatureConfig {
  id: string;
  code: string;
  modelType: string;
  titleZh: string;
  titleEn: string;
  category: MathCategory;
  audioFamily: AudioFamily;
  latexFormula: string;
  description: string;
  coreColor: string;
  glowColor: string;
  accentColor?: string;
  params?: ModelParams;
  scale: number;
  orbit: OrbitalElements;
  rotationAxis: THREE.Vector3;
  rotationSpeed: number;
}

export interface CreatureUniforms {
  [uniform: string]: THREE.IUniform<unknown>;
  uTime: THREE.IUniform<number>;
  uPlayerPos: THREE.IUniform<THREE.Vector3>;
  uPlayerVel: THREE.IUniform<THREE.Vector3>;
  uWakeRadius: THREE.IUniform<number>;
  uCoreColor: THREE.IUniform<THREE.Color>;
  uGlowColor: THREE.IUniform<THREE.Color>;
}

/** 声明式 LOD：每个部件提供 drawRange / 实例数 / 几何切换 / 可见性 */
export interface LodPart {
  object: THREE.Object3D;
  visible?: (level: 0 | 1 | 2) => boolean;
  drawRange?: readonly [number, number, number];
  instanceCount?: readonly [number, number, number];
  geometrySwap?: { lod0: THREE.BufferGeometry; lod1: THREE.BufferGeometry };
}

function makeGlowTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,255,255,0.6)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export abstract class BaseMathCreature {
  public readonly group: THREE.Group = new THREE.Group();
  public readonly config: MathCreatureConfig;
  public readonly uniforms: CreatureUniforms;
  /** 个体自主行为：独立时钟变速、游荡与玩家反应 */
  public readonly behavior: CreatureBehavior;
  public currentLOD: 0 | 1 | 2 = 0;
  public ready = false;
  protected readonly resources = new ResourceTracker();
  protected readonly lodParts: LodPart[] = [];
  protected lodSprite: THREE.Sprite | null = null;

  private static glowTexture: THREE.Texture | null = null;
  /** 黎曼巨兽当前质心（宇宙根局部空间），每帧由主循环同步 */
  private readonly referenceCenter = new THREE.Vector3();
  private readonly tmpPos = new THREE.Vector3();
  private readonly tmpTangent = new THREE.Vector3();
  private readonly tmpLook = new THREE.Vector3();

  constructor(config: MathCreatureConfig) {
    this.config = config;
    this.behavior = new CreatureBehavior(config.modelType, config.category, config.orbit.seed);
    this.uniforms = {
      uTime: { value: 0 },
      uPlayerPos: { value: new THREE.Vector3() },
      uPlayerVel: { value: new THREE.Vector3() },
      uWakeRadius: { value: Math.max(55, config.scale * 2.2) },
      uCoreColor: { value: new THREE.Color(config.coreColor) },
      uGlowColor: { value: new THREE.Color(config.glowColor) },
    };
    this.group.scale.setScalar(config.scale);
    this.group.userData.codexType = config.modelType;
  }

  public abstract init(): void;

  /** 幂等初始化入口；分帧调度器只调用这里，ready 之前不参与 LOD/音频/拾取 */
  public initialize(): void {
    if (this.ready) return;
    this.init();
    this.ready = true;
  }

  /** 注册一个参与 LOD 的部件；基类统一应用 drawRange / 实例数 / 几何切换 */
  protected addLodPart(part: LodPart): void {
    this.lodParts.push(part);
  }

  public setLOD(level: 0 | 1 | 2): void {
    this.currentLOD = level;
    for (const part of this.lodParts) {
      part.object.visible = part.visible ? part.visible(level) : level < 2;
      if (level === 2) continue;
      const target = part.object as THREE.Object3D & {
        geometry?: THREE.BufferGeometry;
        count?: number;
      };
      if (part.geometrySwap && target.geometry) {
        target.geometry = level === 0 ? part.geometrySwap.lod0 : part.geometrySwap.lod1;
      }
      if (part.drawRange && target.geometry) {
        target.geometry.setDrawRange(0, part.drawRange[level]);
      }
      if (part.instanceCount && typeof target.count === 'number') {
        target.count = part.instanceCount[level];
      }
    }
    this.setSpriteVisible(level === 2);
  }

  /** 默认统一释放已登记资源；子类可覆盖并在末尾调用 super.dispose() */
  public dispose(): void {
    this.resources.disposeAll();
  }

  /** 绕局部三轴匀速自旋，替代各模型重复的 rotateX/Y/Z 三连 */
  protected spinBy(delta: number, x: number, y: number, z: number): void {
    if (x) this.group.rotateX(delta * x);
    if (y) this.group.rotateY(delta * y);
    if (z) this.group.rotateZ(delta * z);
  }

  /** 动态引力母体：黎曼巨兽质心在宇宙根局部空间的坐标 */
  public setReferenceFrame(center: THREE.Vector3): void {
    this.referenceCenter.copy(center);
  }

  /** LOD2 远距星点：带本体主色的径向发光 Sprite */
  protected ensureSprite(): THREE.Sprite {
    if (!this.lodSprite) {
      if (!BaseMathCreature.glowTexture) BaseMathCreature.glowTexture = makeGlowTexture();
      const mat = new THREE.SpriteMaterial({
        map: BaseMathCreature.glowTexture,
        color: new THREE.Color(this.config.glowColor).multiplyScalar(2.2),
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      });
      this.lodSprite = new THREE.Sprite(mat);
      // group 已带 config.scale，精灵只需按本体半径的 2.6 倍局部缩放
      this.lodSprite.scale.setScalar(2.6);
      this.lodSprite.visible = false;
      this.group.add(this.lodSprite);
    }
    return this.lodSprite;
  }

  protected setSpriteVisible(visible: boolean): void {
    this.ensureSprite().visible = visible;
  }

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    this.behavior.tick(delta);
    sampleOrbit(
      this.config.orbit,
      this.behavior.time,
      this.referenceCenter,
      this.tmpPos,
      this.tmpTangent,
    );
    this.behavior.applyOffsets(this.tmpPos, this.tmpTangent, playerPos, delta);
    this.group.position.copy(this.tmpPos);
    this.tmpLook.copy(this.tmpPos).add(this.tmpTangent);
    this.group.lookAt(this.tmpLook);
    // 姿态微动由行为档案增益驱动，同型个体不同步
    this.group.rotateZ(this.behavior.rollAngle(elapsed));
    this.group.rotateX(this.behavior.pitchAngle(elapsed));
    this.group.rotateOnAxis(
      this.config.rotationAxis,
      this.config.rotationSpeed * this.behavior.spinScale * delta,
    );

    this.uniforms.uTime.value = elapsed;
    (this.uniforms.uPlayerPos.value as THREE.Vector3).copy(playerPos);
    (this.uniforms.uPlayerVel.value as THREE.Vector3).copy(playerVel);
  }
}
