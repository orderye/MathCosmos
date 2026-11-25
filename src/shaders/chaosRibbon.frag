uniform float uTime;
uniform float uFlowSpeed;
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

varying float vProgress;
varying float vDistance;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(vViewDir);
  float fresnel = pow(1.0 - abs(dot(N, V)), 2.0);
  float pulse = pow(0.5 + 0.5 * sin(vProgress * 40.0 - uTime * uFlowSpeed), 4.0);
  vec3 col = mix(uCoreColor, uGlowColor, clamp(vDistance, 0.0, 1.0));
  col = mix(col, uAccentColor, fresnel * 0.55);
  col += uCoreColor * pulse * 0.9;
  col *= 1.0 + vWake * 0.35;
  gl_FragColor = vec4(col, clamp(0.38 + fresnel * 0.42 + pulse * 0.2, 0.0, 0.95));
}
