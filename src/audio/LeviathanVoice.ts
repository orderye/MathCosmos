import * as THREE from 'three';
import { dopplerCents, radialVelocity } from './DopplerService';

const LEVIATHAN_DOPPLER = {
  speedOfSound: 1400,
  minRatio: 0.72,
  maxRatio: 1.4,
  maxCents: 300,
};

/** 黎曼巨兽四声部：低频根音 + 三度/五度泛音 + 高音信标 */
export class LeviathanVoice {
  private readonly gain: GainNode;
  private readonly panner: PannerNode;
  private readonly filter: BiquadFilterNode;
  private readonly oscs: Array<{ osc: OscillatorNode; baseCents: number }> = [];
  private voice4Gain: GainNode | null = null;
  private readonly tmpDir = new THREE.Vector3();

  constructor(
    ctx: AudioContext,
    route: (node: AudioNode) => void,
  ) {
    this.gain = ctx.createGain();
    this.gain.gain.value = 0;
    this.panner = ctx.createPanner();
    this.panner.panningModel = 'HRTF';
    this.panner.distanceModel = 'exponential';
    this.panner.refDistance = 350;
    this.panner.rolloffFactor = 1.4;
    this.panner.maxDistance = 2200;

    const specs: Array<[OscillatorType, number, number, number]> = [
      ['sine', 55, 0, 0.45],
      ['triangle', 82.41, 3, 0.28],
      ['sawtooth', 110, -5, 0.16],
      ['sine', 246.94, 4, 0.1],
    ];
    const rootGains: GainNode[] = [];
    this.filter = ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 180;

    specs.forEach(([type, freq, cents, gainValue], i) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      osc.detune.value = cents;
      const g = ctx.createGain();
      g.gain.value = gainValue;
      if (i === 2) osc.connect(this.filter).connect(g);
      else if (i === 1) {
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 240;
        osc.connect(lp).connect(g);
      } else {
        osc.connect(g);
      }
      g.connect(this.gain);
      if (i === 3) this.voice4Gain = g;
      if (i === 0) rootGains.push(g);
      this.oscs.push({ osc, baseCents: cents });
      osc.start();
    });

    const rootGain = rootGains[0];
    if (rootGain) {
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.11;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.06;
      lfo.connect(lfoGain).connect(rootGain.gain);
      lfo.start();
    }

    this.gain.connect(this.panner);
    route(this.panner);
  }

  update(
    now: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
    leviathanPos: THREE.Vector3,
    leviathanVel: THREE.Vector3,
  ): number {
    const dist = playerPos.distanceTo(leviathanPos);
    this.gain.gain.setTargetAtTime(dist < 2000 ? 0.32 : 0, now, 0.25);
    this.panner.positionX.value = leviathanPos.x;
    this.panner.positionY.value = leviathanPos.y;
    this.panner.positionZ.value = leviathanPos.z;
    this.filter.frequency.setTargetAtTime(
      180 + 770 * (1 - Math.min(dist / 2000, 1)),
      now,
      0.2,
    );
    this.voice4Gain?.gain.setTargetAtTime(dist < 850 ? 0.1 : 0, now, 0.3);

    const radial = radialVelocity(playerPos, playerVel, leviathanPos, leviathanVel, this.tmpDir);
    const cents = dopplerCents(radial, LEVIATHAN_DOPPLER);
    for (const voice of this.oscs) {
      voice.osc.detune.setTargetAtTime(voice.baseCents + cents, now, 0.1);
    }
    return dist;
  }

  dispose(): void {
    for (const voice of this.oscs) voice.osc.stop();
    this.oscs.length = 0;
  }
}
