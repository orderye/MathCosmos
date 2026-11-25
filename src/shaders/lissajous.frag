uniform float uTime;
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(vViewDir);
  float fresnel = pow(1.0 - abs(dot(N, V)), 2.2);

  float forward = 0.5 + 0.5 * sin(vUv.x * 50.0 - uTime * 4.0);
  float backward = 0.5 + 0.5 * sin(vUv.x * 50.0 + uTime * 4.0);
  float interference = pow(forward * backward, 3.0);

  vec3 col = mix(uGlowColor, uAccentColor, forward);
  col = mix(col, uCoreColor, backward * 0.55);
  col += uCoreColor * interference * 1.6;
  col += uCoreColor * fresnel * 0.5;
  col *= 1.0 + vWake * 0.35;
  gl_FragColor = vec4(col, 0.55 + fresnel * 0.3 + interference * 0.25);
}
