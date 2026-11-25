import * as THREE from 'three';
import type { BaseMathCreature } from '../entities/BaseMathCreature';
import { buildAmbience, buildEngine, updateEngine, type EngineVoice } from './Ambience';
import { makeWhiteNoise } from './AudioBuffers';
import { LeviathanVoice } from './LeviathanVoice';
import { triggerArc, triggerWarpDrop } from './Sfx';
import { SpatialMixer } from './SpatialMixer';
import { VoicePool } from './VoicePool';

/** 音频门面：只负责上下文生命周期与每帧编排 */
export class CosmicAudioEngine {
  enabled = false;
  private ctx: AudioContext | null = null;
  private mixer: SpatialMixer | null = null;
  private engineVoice: EngineVoice | null = null;
  private leviathanVoice: LeviathanVoice | null = null;
  private voicePool: VoicePool | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private nextArcAt = 0;
  private lastWarpState = false;

  /** 首次用户交互后调用；浏览器自动播放合规 */
  async unlock(): Promise<void> {
    if (!this.ctx) this.build();
    if (this.ctx?.state === 'suspended') await this.ctx.resume();
    this.enabled = true;
    this.mixer?.fadeMaster(0.72, 0.8);
  }

  async toggle(): Promise<boolean> {
    if (!this.ctx || !this.enabled) {
      await this.unlock();
      return true;
    }
    this.enabled = false;
    this.mixer?.fadeMaster(0, 0.8);
    return false;
  }

  update(
    elapsed: number,
    camera: THREE.PerspectiveCamera,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
    warpFactor: number,
    creatures: BaseMathCreature[],
    universeRoot: THREE.Object3D,
    leviathanPos: THREE.Vector3,
    leviathanVel: THREE.Vector3,
  ): void {
    const ctx = this.ctx;
    if (!ctx || !this.mixer || !this.engineVoice || !this.leviathanVoice || !this.voicePool) return;
    const now = ctx.currentTime;

    this.mixer.syncListener(camera);
    const speed = playerVel.length();
    updateEngine(this.engineVoice, now, speed, warpFactor);

    const leviathanDist = this.leviathanVoice.update(
      now,
      playerPos,
      playerVel,
      leviathanPos,
      leviathanVel,
    );

    const warping = warpFactor > 0.55;
    if (warping && !this.lastWarpState) triggerWarpDrop(ctx, (node) => this.mixer!.route(node));
    this.lastWarpState = warping;

    if (leviathanDist < 700 && now >= this.nextArcAt) {
      this.nextArcAt = triggerArc(
        ctx,
        (node) => this.mixer!.route(node),
        this.noiseBuffer,
        leviathanDist,
        leviathanPos,
      );
    }

    this.voicePool.update(now, playerPos, playerVel, creatures, universeRoot);
    void elapsed;
  }

  dispose(): void {
    this.voicePool?.dispose();
    this.leviathanVoice?.dispose();
    void this.ctx?.close();
    this.ctx = null;
    this.mixer = null;
    this.engineVoice = null;
    this.leviathanVoice = null;
    this.voicePool = null;
  }

  private build(): void {
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.mixer = new SpatialMixer(ctx);
    const route = (node: AudioNode): void => this.mixer!.route(node);

    buildAmbience(ctx, route);
    this.engineVoice = buildEngine(ctx, route);
    this.leviathanVoice = new LeviathanVoice(ctx, route);
    this.voicePool = new VoicePool(ctx, route);
    this.noiseBuffer = makeWhiteNoise(ctx, 0.04);
  }
}
