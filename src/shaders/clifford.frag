uniform float uTime;
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

varying vec2 vUv;
varying float vDepth4D;
varying vec3 vWorldPos;
varying vec3 vViewDir;

void main() {
  vec3 V = normalize(vViewDir);
  vec3 radial = normalize(vWorldPos);
  float fresnel = pow(1.0 - abs(dot(radial, V)), 2.4);

  // Villarceau 斜交线：u ± v = const
  float a = abs(fract((vUv.x + vUv.y) * 8.0) - 0.5);
  float b = abs(fract((vUv.x - vUv.y) * 8.0) - 0.5);
  float line = 1.0 - smoothstep(0.0, 0.035, min(a, b));

  vec3 col = mix(uGlowColor, uAccentColor, fresnel * 0.65 + vDepth4D * 0.25);
  col = mix(col, uCoreColor, line * 0.75);
  float pulse = 0.5 + 0.5 * sin(uTime * 1.4 + vDepth4D * 8.0);
  col += uAccentColor * pulse * 0.12;
  gl_FragColor = vec4(col, clamp(0.14 + fresnel * 0.55 + line * 0.38, 0.0, 0.92));
}
