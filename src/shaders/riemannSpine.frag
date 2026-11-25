uniform vec3 uCoreColor;
uniform float uTime;
uniform float uIsSheath;

varying vec2 vUv;
varying float vWake;
varying vec3 vNormalW;
varying vec3 vViewDir;

void main() {
  // 自底向上高斯脉冲波，速度 0.25（主文档 §3.3）
  float phase = fract(vUv.x * 2.0 - uTime * 0.25);
  float pulse = exp(-pow(phase / 0.07, 2.0)) + exp(-pow((phase - 1.0) / 0.07, 2.0));

  vec3 col;
  float alpha = 1.0;
  if (uIsSheath > 0.5) {
    float facing = abs(dot(normalize(vNormalW), normalize(vViewDir)));
    float body = 0.1 + 0.3 * pow(facing, 0.7);
    col = uCoreColor * (body + pulse * 1.2);
    alpha = body * 0.8 + pulse * 0.5;
  } else {
    col = uCoreColor * (1.0 + pulse * 0.35);
  }

  col *= 1.0 + vWake * 0.4;
  col = mix(col, vec3(1.0), vWake * 0.25);
  gl_FragColor = vec4(col, alpha);
}