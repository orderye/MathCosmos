uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;
uniform float uFlowSpeed;
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(vViewDir);
  float fresnel = pow(1.0 - abs(dot(N, V)), 2.2);

  // 沿 u 方向流淌的双色流光
  float flow = sin(vUv.x * 18.0 - uTime * uFlowSpeed) * 0.5 + 0.5;
  vec3 col = mix(uCoreColor, uAccentColor, flow * 0.65);
  col = mix(col, uGlowColor, fresnel);

  col *= 1.0 + vWake * 0.4;
  col = mix(col, vec3(1.0), vWake * 0.25);
  gl_FragColor = vec4(col, 0.85 + 0.15 * fresnel);
}