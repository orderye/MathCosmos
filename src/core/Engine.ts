import * as THREE from 'three';
import { PerformanceProbe } from './PerformanceProbe';
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  ToneMappingEffect,
  ToneMappingMode,
  VignetteEffect,
} from 'postprocessing';

export type UpdateFn = (delta: number, elapsed: number) => void;

export class Engine {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly universeRoot: THREE.Group;
  readonly perf: PerformanceProbe;

  private readonly composer: EffectComposer;
  private readonly onUpdate: UpdateFn;
  private rafId = 0;
  private lastTime = 0;
  private elapsed = 0;

  constructor(canvas: HTMLCanvasElement, onUpdate: UpdateFn) {
    this.onUpdate = onUpdate;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: 'high-performance',
      stencil: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.NoToneMapping;
    // 手动重置：EffectComposer 多 pass 下统计整帧真实 Draw Call
    this.renderer.info.autoReset = false;
    this.perf = new PerformanceProbe(this.renderer);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#030306');

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      12000,
    );

    this.universeRoot = new THREE.Group();
    this.scene.add(this.universeRoot);

    this.composer = new EffectComposer(this.renderer, {
      frameBufferType: THREE.HalfFloatType,
    });
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    const bloom = new BloomEffect({
      luminanceThreshold: 0.85,
      luminanceSmoothing: 0.02,
      mipmapBlur: true,
      intensity: 1.35,
    });
    const toneMapping = new ToneMappingEffect({ mode: ToneMappingMode.ACES_FILMIC });
    const vignette = new VignetteEffect({ offset: 0.28, darkness: 0.55 });
    this.composer.addPass(new EffectPass(this.camera, bloom, toneMapping, vignette));

    window.addEventListener('resize', this.handleResize);
  }

  start(): void {
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  dispose(): void {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.handleResize);
    this.composer.dispose();
    this.renderer.dispose();
  }

  private readonly tick = (now: number): void => {
    this.rafId = requestAnimationFrame(this.tick);
    // 钳制 0 ≤ Δt ≤ 0.05s：RAF 时间戳可能早于 start() 时刻（首帧负 delta），切后台防爆帧
    const delta = Math.min(Math.max((now - this.lastTime) / 1000, 0), 0.05);
    this.lastTime = now;
    this.elapsed += delta;
    const updateStart = performance.now();
    this.onUpdate(delta, this.elapsed);
    const updateEnd = performance.now();
    this.renderer.info.reset();
    this.composer.render(delta);
    const renderEnd = performance.now();
    this.perf.sample(updateEnd - updateStart, renderEnd - updateEnd, delta * 1000);
  };

  private readonly handleResize = (): void => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);
  };
}