import { makeAmbienceBuffer } from './AudioBuffers';

export function buildAmbience(ctx: AudioContext, route: (node: AudioNode) => void): void {
  const src = ctx.createBufferSource();
  src.buffer = makeAmbienceBuffer(ctx, 6);
  src.loop = true;
  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 15;
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 115;
  lowpass.Q.value = 0.8;
  const gain = ctx.createGain();
  gain.gain.value = 0.08;
  src.connect(highpass).connect(lowpass).connect(gain);
  route(gain);

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 28;
  lfo.connect(lfoGain).connect(lowpass.frequency);
  src.start();
  lfo.start();
}

export interface EngineVoice {
  filter: BiquadFilterNode;
  gain: GainNode;
}

export function buildEngine(ctx: AudioContext, route: (node: AudioNode) => void): EngineVoice {
  const saw = ctx.createOscillator();
  saw.type = 'sawtooth';
  saw.frequency.value = 36;
  const tri = ctx.createOscillator();
  tri.type = 'triangle';
  tri.frequency.value = 72.6;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 75;
  filter.Q.value = 1.2;
  const gain = ctx.createGain();
  gain.gain.value = 0.015;
  saw.connect(filter);
  tri.connect(filter);
  filter.connect(gain);
  route(gain);
  saw.start();
  tri.start();
  return { filter, gain };
}

export function updateEngine(
  voice: EngineVoice,
  now: number,
  speed: number,
  warpFactor: number,
): void {
  const cutoff = 75 + 345 * Math.pow(Math.min(speed / 460, 1), 1.4);
  voice.filter.frequency.setTargetAtTime(cutoff, now, 0.05);
  voice.filter.Q.setTargetAtTime(1.2 + 2.8 * warpFactor, now, 0.05);
  const gain = 0.015 + Math.min(speed / 145, 1) * 0.075 + warpFactor * 0.09;
  voice.gain.gain.setTargetAtTime(gain, now, 0.08);
}
