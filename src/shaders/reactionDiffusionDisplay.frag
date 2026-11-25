uniform sampler2D uState;
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

varying vec2 vUv;
varying float vDisp;
varying vec3 vNormalW;
varying vec3 vViewDir;

void main() {
  float v = texture2D(uState, vUv).g;
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(vViewDir);
  float fresnel = pow(1.0 - abs(dot(N, V)), 2.0);
  vec3 col = mix(uGlowColor * 0.35, uAccentColor, smoothstep(0.1, 0.55, v));
  col = mix(col, uCoreColor, smoothstep(0.55, 0.95, v) * 0.85);
  col += uCoreColor * fresnel * 0.5;
  gl_FragColor = vec4(col, 0.82 + fresnel * 0.15);
}
