import type * as THREE from 'three';
import type { AudioFamily } from '../data/modelTypes';

export interface Voice {
  carrier: OscillatorNode;
  harmonic: OscillatorNode;
  overtone: OscillatorNode;
  mod: OscillatorNode;
  modGain: GainNode;
  gain: GainNode;
  panner: PannerNode;
  active: boolean;
  entityId: string | null;
  baseFreq: number;
  releaseAt: number;
  startedAt: number;
  duration: number;
}

export interface EntitySoundState {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  lastTime: number;
  activeVoice: number;
}

export type SoundCategory = AudioFamily;

export const MIDI: Record<AudioFamily, number[]> = {
  chaos: [69, 71, 73, 76, 78],
  topology: [52, 57, 59, 63, 64],
  'high-dim': [69, 75, 76, 80, 81],
  fractal: [45, 52, 54, 57],
  quantum: [73, 76, 78, 81, 83],
};

export function midiHz(m: number): number {
  return 440 * Math.pow(2, (m - 69) / 12);
}
