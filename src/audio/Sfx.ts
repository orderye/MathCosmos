import * as THREE from 'three';

export function triggerWarpDrop(ctx: AudioContext, route: (node: AudioNode) => void): void {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(42, now + 0.45);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
  osc.connect(gain);
  route(gain);
  osc.start(now);
  osc.stop(now + 0.52);
}

/** 粒子电弧：泊松触发，返回下一次允许触发的时间 */
export function triggerArc(
  ctx: AudioContext,
  route: (node: AudioNode) => void,
  noiseBuffer: AudioBuffer | null,
  dist: number,
  origin: THREE.Vector3,
): number {
  const now = ctx.currentTime;
  const rate = 3 + Math.random() * 4;
  const nextAt = now - Math.log(Math.max(Math.random(), 1e-6)) / rate;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 2400 + Math.random() * 4400;
  bp.Q.value = 8.5;
  const gain = ctx.createGain();
  gain.gain.value = 0.08 * (1 - Math.min(dist / 700, 1));
  const panner = ctx.createPanner();
  panner.panningModel = 'HRTF';
  panner.positionX.value = origin.x;
  panner.positionY.value = origin.y;
  panner.positionZ.value = origin.z;
  src.connect(bp).connect(gain).connect(panner);
  route(panner);
  src.start(now);
  src.stop(now + 0.008 + Math.random() * 0.014);
  return nextAt;
}
