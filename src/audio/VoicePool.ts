import * as THREE from 'three';
import type { BaseMathCreature } from '../entities/BaseMathCreature';
import { MIDI, midiHz, type EntitySoundState, type SoundCategory, type Voice } from './audioTypes';
import { dopplerCents, radialVelocity } from './DopplerService';

const CREATURE_DOPPLER = {
  speedOfSound: 1600,
  minRatio: 0.72,
  maxRatio: 1.38,
};

/** 8 声部复音池 + 实体接近触发 + ADSR/冷却/实体多普勒 */
export class VoicePool {
  private readonly voices: Voice[] = [];
  private readonly states = new Map<string, EntitySoundState>();
  private readonly cooldown = new Map<string, number>();
  private readonly activeIds = new Set<string>();
  private readonly tmpEntity = new THREE.Vector3();
  private readonly tmpDir = new THREE.Vector3();

  constructor(
    private readonly ctx: AudioContext,
    private readonly route: (node: AudioNode) => void,
    count = 8,
  ) {
    for (let i = 0; i < count; i++) this.voices.push(this.createVoice());
  }

  private createVoice(): Voice {
    const ctx = this.ctx;
    const carrier = ctx.createOscillator();
    const harmonic = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const mod = ctx.createOscillator();
    const modGain = ctx.createGain();
    const gain = ctx.createGain();
    const panner = ctx.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 120;
    panner.maxDistance = 600;
    gain.gain.value = 0;
    carrier.connect(gain);
    harmonic.connect(gain);
    overtone.connect(gain);
    mod.connect(modGain).connect(carrier.frequency);
    gain.connect(panner);
    this.route(panner);
    [carrier, harmonic, overtone, mod].forEach((o) => o.start());
    return {
      carrier, harmonic, overtone, mod, modGain, gain, panner,
      active: false, entityId: null, baseFreq: 440, releaseAt: 0,
      startedAt: 0, duration: 2,
    };
  }

  update(
    now: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
    creatures: BaseMathCreature[],
    universeRoot: THREE.Object3D,
  ): void {
    this.activeIds.clear();
    for (const c of creatures) {
      if (!c.ready) continue;
      this.tmpEntity.copy(c.group.position).add(universeRoot.position);
      const dist = this.tmpEntity.distanceTo(playerPos);
      if (dist > 170) continue;
      this.activeIds.add(c.config.id);
      let state = this.states.get(c.config.id);
      if (!state) {
        state = {
          pos: this.tmpEntity.clone(),
          vel: new THREE.Vector3(),
          lastTime: now,
          activeVoice: -1,
        };
        this.states.set(c.config.id, state);
      }
      const dt = Math.max(now - state.lastTime, 1 / 120);
      state.vel.subVectors(this.tmpEntity, state.pos).multiplyScalar(1 / dt);
      if (state.vel.length() > 200) state.vel.setLength(200);
      state.pos.copy(this.tmpEntity);
      state.lastTime = now;

      const cooldownUntil = this.cooldown.get(c.config.id) ?? 0;
      if (dist < 120 && now >= cooldownUntil && state.activeVoice < 0) {
        const voiceIndex = this.voices.findIndex((v) => !v.active);
        if (voiceIndex >= 0) {
          this.triggerVoice(voiceIndex, c.config.audioFamily, c.config.id);
          state.activeVoice = voiceIndex;
        }
      }

      const voiceIndex = state.activeVoice;
      if (voiceIndex >= 0) {
        const voice = this.voices[voiceIndex];
        const radial = radialVelocity(playerPos, playerVel, this.tmpEntity, state.vel, this.tmpDir);
        const cents = dopplerCents(radial, CREATURE_DOPPLER);
        voice.carrier.detune.setTargetAtTime(cents, now, 0.04);
        voice.harmonic.detune.setTargetAtTime(cents, now, 0.04);
        voice.overtone.detune.setTargetAtTime(cents, now, 0.04);
        voice.panner.positionX.value = this.tmpEntity.x;
        voice.panner.positionY.value = this.tmpEntity.y;
        voice.panner.positionZ.value = this.tmpEntity.z;
        if (dist > 165) this.releaseVoice(voiceIndex, c.config.id);
      }
    }

    for (let i = 0; i < this.voices.length; i++) {
      const v = this.voices[i];
      if (v.active && v.entityId && now >= v.startedAt + v.duration) {
        this.releaseVoice(i, v.entityId);
      }
    }

    for (const [id, state] of this.states) {
      if (!this.activeIds.has(id) && state.activeVoice >= 0) {
        this.releaseVoice(state.activeVoice, id);
      }
      if (now - state.lastTime > 10 && state.activeVoice < 0) this.states.delete(id);
    }
    for (const v of this.voices) {
      if (v.active && v.entityId && !this.activeIds.has(v.entityId) && now >= v.releaseAt) {
        this.releaseVoice(this.voices.indexOf(v), v.entityId);
      }
    }
  }

  private triggerVoice(index: number, category: SoundCategory, entityId: string): void {
    const now = this.ctx.currentTime;
    const v = this.voices[index];
    const pool = MIDI[category];
    const base = midiHz(pool[Math.floor(Math.random() * pool.length)]);
    v.baseFreq = base;
    v.active = true;
    v.entityId = entityId;
    v.releaseAt = now + 8;
    v.startedAt = now;
    v.duration =
      category === 'topology' ? 2.4
        : category === 'fractal' ? 2.8
          : category === 'chaos' ? 1.6
            : category === 'high-dim' ? 2.2 : 1.0;
    v.gain.gain.cancelScheduledValues(now);
    v.gain.gain.setValueAtTime(0.0001, now);
    const attack =
      category === 'topology' ? 0.28 : category === 'fractal' ? 0.35 : category === 'chaos' ? 0.04 : 0.015;
    const peak = category === 'topology' ? 0.11 : 0.085;
    v.gain.gain.exponentialRampToValueAtTime(peak, now + attack);
    v.gain.gain.exponentialRampToValueAtTime(peak * 0.45, now + attack + 0.45);

    v.carrier.type = category === 'topology' ? 'triangle' : 'sine';
    v.harmonic.type = category === 'fractal' ? 'square' : category === 'topology' ? 'triangle' : 'sine';
    v.overtone.type = 'sine';
    v.carrier.frequency.setValueAtTime(base, now);
    v.harmonic.frequency.setValueAtTime(base * (category === 'fractal' ? 1 : category === 'high-dim' ? 2.76 : 2), now);
    v.overtone.frequency.setValueAtTime(base * (category === 'chaos' ? 2 : category === 'high-dim' ? 5.4 : 2.76), now);
    v.harmonic.detune.value = category === 'topology' ? 6 : 0;
    v.overtone.detune.value = category === 'topology' ? -6 : 0;

    if (category === 'chaos') {
      v.mod.type = 'sine';
      v.mod.frequency.value = base * 2;
      v.modGain.gain.setValueAtTime(180, now);
      v.modGain.gain.exponentialRampToValueAtTime(20, now + 0.4);
    } else {
      v.modGain.gain.value = 0;
    }
  }

  private releaseVoice(index: number, entityId: string): void {
    const v = this.voices[index];
    if (!v) return;
    const now = this.ctx.currentTime;
    v.gain.gain.cancelScheduledValues(now);
    v.gain.gain.setTargetAtTime(0.0001, now, 0.18);
    v.active = false;
    v.releaseAt = now + 1.2;
    this.cooldown.set(entityId, now + 4.5);
    const state = this.states.get(entityId);
    if (state) state.activeVoice = -1;
  }

  dispose(): void {
    for (const v of this.voices) {
      v.carrier.stop();
      v.harmonic.stop();
      v.overtone.stop();
      v.mod.stop();
    }
    this.voices.length = 0;
    this.states.clear();
  }
}
