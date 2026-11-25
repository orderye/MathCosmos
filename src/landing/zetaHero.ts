import * as THREE from 'three';
import { createOrbitalElements } from '../core/CelestialOrbitEngine';
import { NUMBER_PHYSICS_MODELS } from '../data/blueprints/numberPhysicsModels';
import type { MathCreatureConfig } from '../entities/BaseMathCreature';
import { ZetaRibbon } from '../entities/models/ZetaRibbon';

const ZETA_ENTRY = NUMBER_PHYSICS_MODELS.find((entry) => entry.modelType === 'zeta');

const BASE_SCALE = 1.22;
const CAMERA_FOV = 38;
const CAMERA_Z = 5.0;
const LEAVE_CAMERA_Z = 1.05;
const LEAVE_SECONDS = 0.9;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildConfig(): MathCreatureConfig {
  const entry = ZETA_ENTRY;
  if (!entry) throw new Error('landing: 未找到 zeta 图鉴条目');
  const rnd = mulberry32(20261125);
  return {
    id: 'zeta_hero',
    code: entry.code,
    modelType: entry.modelType,
    titleZh: entry.titleZh,
    titleEn: entry.titleEn,
    category: entry.category,
    audioFamily: entry.audioFamily,
    latexFormula: entry.latexFormula,
    description: entry.description,
    coreColor: entry.coreColor,
    glowColor: entry.glowColor,
    accentColor: entry.accentColor,
    params: entry.params,
    scale: BASE_SCALE,
    orbit: createOrbitalElements('inner', rnd, 0),
    rotationAxis: new THREE.Vector3(0, 1, 0),
    rotationSpeed: 0.2,
    // 主页常驻展示，不参与主宇宙的诞生—外飞—消散循环
    lifecycle: { lifetime: 120, gap: 0, spawnRadius: 0, initialAge: 60 },
  };
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export interface ZetaHeroOptions {
  reducedMotion?: boolean;
}

/** 主页中央的黎曼 ζ 临界带实时可视化：复用 M35 的几何与着色器 */
export class ZetaHero {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly ribbon: ZetaRibbon;
  private readonly clock = new THREE.Clock();
  private readonly stage: HTMLElement;
  private readonly resizeObserver: ResizeObserver;
  private readonly reducedMotion: boolean;

  private readonly pointer = new THREE.Vector2();
  private readonly pointerTarget = new THREE.Vector2();
  private hoverBoost = 0;
  private hoverTarget = 0;
  private spin = 0;
  private leaving = false;
  private leaveElapsed = 0;
  private frame = 0;

  constructor(canvas: HTMLCanvasElement, stage: HTMLElement, options: ZetaHeroOptions = {}) {
    this.stage = stage;
    this.reducedMotion = options.reducedMotion ?? false;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearAlpha(0);
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    this.camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 60);
    this.camera.position.set(0, 0.04, CAMERA_Z);
    this.camera.lookAt(0, 0, 0);

    this.ribbon = new ZetaRibbon(buildConfig());
    this.ribbon.initialize();
    this.scene.add(this.ribbon.group);
    this.ribbon.group.rotation.set(0.06, -0.38, 0);
    this.ribbon.group.scale.setScalar(BASE_SCALE);

    const uniforms = this.ribbon.uniforms;
    (uniforms.uPlayerPos.value as THREE.Vector3).set(0, 0, 0);
    (uniforms.uPlayerVel.value as THREE.Vector3).set(0, 0, 0);
    uniforms.uWakeRadius.value = 0.15;

    stage.addEventListener('pointermove', this.onPointerMove, { passive: true });
    stage.addEventListener('pointerenter', this.onPointerEnter, { passive: true });
    stage.addEventListener('pointerleave', this.onPointerLeave, { passive: true });

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(stage);
    this.resize();

    document.addEventListener('visibilitychange', this.onVisibility);
    this.frame = requestAnimationFrame(this.tick);
  }

  /** 相机向曲面推进，配合页面淡出完成“跃入宇宙”的转场 */
  public enter(): void {
    if (this.leaving) return;
    this.leaving = true;
    this.leaveElapsed = 0;
  }

  public get leaveMilliseconds(): number {
    return this.reducedMotion ? 180 : Math.round(LEAVE_SECONDS * 1000);
  }

  public dispose(): void {
    cancelAnimationFrame(this.frame);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.resizeObserver.disconnect();
    this.stage.removeEventListener('pointermove', this.onPointerMove);
    this.stage.removeEventListener('pointerenter', this.onPointerEnter);
    this.stage.removeEventListener('pointerleave', this.onPointerLeave);
    this.ribbon.dispose();
    this.renderer.dispose();
  }

  private readonly onPointerMove = (event: PointerEvent): void => {
    const rect = this.stage.getBoundingClientRect();
    this.pointerTarget.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -(((event.clientY - rect.top) / rect.height) * 2 - 1),
    );
  };

  private readonly onPointerEnter = (): void => {
    this.hoverTarget = 1;
  };

  private readonly onPointerLeave = (): void => {
    this.hoverTarget = 0;
  };

  private readonly onVisibility = (): void => {
    if (document.hidden) {
      cancelAnimationFrame(this.frame);
    } else {
      this.clock.getDelta();
      this.frame = requestAnimationFrame(this.tick);
    }
  };

  private resize(): void {
    const width = Math.max(this.stage.clientWidth, 1);
    const height = Math.max(this.stage.clientHeight, 1);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private readonly tick = (): void => {
    this.frame = requestAnimationFrame(this.tick);
    const delta = Math.min(this.clock.getDelta(), 0.05);
    const elapsed = this.clock.elapsedTime;

    const motion = this.reducedMotion ? 0.25 : 1;
    this.pointer.lerp(this.pointerTarget, 0.045);
    this.hoverBoost += (this.hoverTarget - this.hoverBoost) * 0.06;

    this.spin += delta * (0.16 + this.hoverBoost * 0.9) * motion;

    if (this.leaving) {
      this.leaveElapsed += delta;
      const k = easeInOutCubic(Math.min(this.leaveElapsed / LEAVE_SECONDS, 1));
      this.camera.position.z = THREE.MathUtils.lerp(CAMERA_Z, LEAVE_CAMERA_Z, k);
      this.camera.position.x *= 0.86;
      this.camera.position.y *= 0.86;
      this.spin += delta * 2.4 * k;
    } else {
      this.camera.position.x = this.pointer.x * 0.34 * motion;
      this.camera.position.y = 0.04 + this.pointer.y * 0.26 * motion;
    }
    this.camera.lookAt(0, 0, 0);

    this.ribbon.group.rotation.y = -0.38 + this.spin + this.pointer.x * 0.1 * motion;
    this.ribbon.group.rotation.x = 0.06 - this.pointer.y * 0.08 * motion;
    this.ribbon.group.scale.setScalar(
      BASE_SCALE * (1 + Math.sin(elapsed * 0.8) * 0.012 * motion + this.hoverBoost * 0.02),
    );
    this.ribbon.uniforms.uTime.value = elapsed;

    this.renderer.render(this.scene, this.camera);
  };
}
