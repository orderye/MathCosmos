uniform float uTime;
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

varying vec2 vUv;
varying float vPhase;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(vViewDir);
  float fresnel = pow(1.0 - abs(dot(N, V)), 2.4);
  float flow = 0.5 + 0.5 * sin(vUv.y * 18.0 - uTime * 2.2 + vUv.x * 4.0);
  vec3 col = mix(uAccentColor, uGlowColor, vPhase);
  col = mix(col, uCoreColor, fresnel * 0.7 + flow * 0.15);
  col *= 1.0 + vWake * 0.35;
  gl_FragColor = vec4(col, clamp(0.2 + fresnel * 0.7 + vWake * 0.25, 0.0, 0.95));
}
