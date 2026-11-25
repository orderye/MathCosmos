uniform float uTime;

varying float vHue;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

vec3 hsv2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {
  vec3 base = hsv2rgb(vec3(vHue, 0.8, 1.0));
  float fres = pow(1.0 - abs(dot(normalize(vNormalW), normalize(vViewDir))), 1.8);
  vec3 col = base * (0.55 + 0.6 * fres);

  // 白色光珠沿每条纤维环同步绕行
  float b = fract(vUv.x - uTime * 0.22 + vHue * 3.0);
  float bead = exp(-pow(min(b, 1.0 - b) / 0.035, 2.0));
  col += vec3(2.6, 2.4, 2.8) * bead;

  col *= 1.0 + vWake * 0.4;
  gl_FragColor = vec4(col, 0.9);
}