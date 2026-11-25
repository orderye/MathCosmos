uniform float uTime;
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

varying float vScalar;
varying float vPhase;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(vViewDir);
  float fresnel = pow(1.0 - abs(dot(N, V)), 2.0);
  float pulse = 0.5 + 0.5 * cos(vPhase * 6.2831 - uTime * 1.6);
  vec3 col = mix(uGlowColor, uAccentColor, clamp(vScalar, 0.0, 1.0));
  col = mix(col, uCoreColor, fresnel * 0.65 + pulse * 0.18);
  col *= 1.0 + vWake * 0.5;
  gl_FragColor = vec4(col, clamp(0.22 + fresnel * 0.72 + pulse * 0.1, 0.0, 0.96));
}
