uniform float uTime;
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;

varying vec2 vUv;
varying float vArg;
varying float vMag;
varying float vZero;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(vViewDir);
  float fresnel = pow(1.0 - abs(dot(N, V)), 2.3);
  float hue = fract(vArg / 6.2831853 + 0.5);
  vec3 col = hsv2rgb(vec3(hue, 0.72, 0.92));
  col *= 0.62 + clamp(vMag, 0.0, 1.0) * 0.55;
  col = mix(col, uGlowColor, fresnel * 0.45);
  float flow = 0.5 + 0.5 * sin(vUv.y * 34.0 - uTime * 2.4 + vUv.x * 8.0);
  col += uCoreColor * (vZero * 1.8 + flow * 0.06);
  col *= 1.0 + vWake * 0.3;
  gl_FragColor = vec4(col, clamp(0.38 + fresnel * 0.32 + vZero * 0.25, 0.0, 0.96));
}
