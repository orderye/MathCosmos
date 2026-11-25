import * as THREE from 'three';
import { makeImpulse } from './AudioBuffers';

/** 主总线、干湿混响、Listener 朝向与母带淡入淡出 */
export class SpatialMixer {
  readonly master: GainNode;
  readonly dry: GainNode;
  readonly reverbSend: GainNode;
  private readonly tmpForward = new THREE.Vector3();
  private readonly tmpUp = new THREE.Vector3();

  constructor(private readonly ctx: AudioContext) {
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -14;
    compressor.knee.value = 18;
    compressor.ratio.value = 6;
    compressor.attack.value = 0.005;
    compressor.release.value = 0.22;
    this.master.connect(compressor).connect(ctx.destination);

    this.dry = ctx.createGain();
    this.dry.connect(this.master);
    this.reverbSend = ctx.createGain();
    const convolver = ctx.createConvolver();
    convolver.buffer = makeImpulse(ctx, 3.8, 2.6);
    const wet = ctx.createGain();
    wet.gain.value = 0.35;
    this.reverbSend.connect(convolver).connect(wet).connect(this.master);
  }

  route(node: AudioNode): void {
    node.connect(this.dry);
    node.connect(this.reverbSend);
  }

  syncListener(camera: THREE.PerspectiveCamera): void {
    const l = this.ctx.listener;
    const p = camera.position;
    const q = camera.quaternion;
    this.tmpForward.set(0, 0, -1).applyQuaternion(q);
    this.tmpUp.set(0, 1, 0).applyQuaternion(q);
    l.positionX.value = p.x;
    l.positionY.value = p.y;
    l.positionZ.value = p.z;
    l.forwardX.value = this.tmpForward.x;
    l.forwardY.value = this.tmpForward.y;
    l.forwardZ.value = this.tmpForward.z;
    l.upX.value = this.tmpUp.x;
    l.upY.value = this.tmpUp.y;
    l.upZ.value = this.tmpUp.z;
  }

  fadeMaster(value: number, duration: number): void {
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now);
    this.master.gain.linearRampToValueAtTime(value, now + duration);
  }
}
