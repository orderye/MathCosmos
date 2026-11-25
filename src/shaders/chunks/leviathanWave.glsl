// 黎曼巨兽全身行波：s=0 尾部、s=1 皇冠，两端摆幅放大、中段收敛（规格 §3.1）
uniform float uTime;
uniform float uSpineWaveAmp;
uniform float uSpineWaveOmega;
uniform float uSpineWaveK;

vec3 leviathanSpineWave(float s) {
    float clampedS = clamp(s, 0.0, 1.0);
    float envelope = 12.0 + uSpineWaveAmp * pow(abs(clampedS * 2.0 - 1.0), 1.8);
    float phase = uSpineWaveOmega * uTime - uSpineWaveK * clampedS;
    float lateral = sin(phase) * envelope;
    float vertical = cos(phase + 0.785398) * envelope * 0.55;
    return vec3(lateral, 0.0, vertical);
}
