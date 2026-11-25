uniform float uTime;
uniform float uMode; // 0 = Lavender 厚壁管, 1 = 洋红细神经纤维

varying float vH;
varying float vT;
varying float vWake;
varying vec3 vNormalW;
varying vec3 vViewDir;

void main() {
  // 生物电波传导：能量自脊柱向末梢逐级扩散（主文档 §3.3）
  float phi = fract(vT - 0.18 * uTime - 0.35 * vH);
  float pulse = exp(-pow(phi / 0.06, 2.0)) + exp(-pow((phi - 1.0) / 0.06, 2.0));

  vec3 col;
  float alpha;
  if (uMode < 0.5) {
    // 参考图：厚壁管哑光薰衣草紫（亮度压在 Bloom 阈值之下），内部 openness 靠深度衰减
    float depthDim = vH < 0.35 ? 1.0 : vH < 0.7 ? 0.35 : 0.5;
    col = mix(vec3(0.42, 0.3, 0.78), vec3(0.3, 0.2, 0.62), smoothstep(0.0, 0.8, vH)) * 0.95 * depthDim;
    col = mix(col, vec3(0.62, 0.56, 0.85) * 0.8, smoothstep(0.85, 1.0, vH));
    col += vec3(0.9, 0.5, 1.0) * pulse * 0.35;
    alpha = 1.0;
  } else {
    // 细纤维走规范色带：白 → 亮品红 → 紫罗兰
    vec3 c0 = vec3(3.2, 3.0, 3.4);
    vec3 c1 = vec3(1.0, 0.13, 1.0) * 1.7;
    vec3 c2 = vec3(0.39, 0.09, 0.93) * 1.6;
    col = mix(c0, c1, smoothstep(0.0, 0.25, vH));
    col = mix(col, c2, smoothstep(0.25, 0.65, vH));
    col += vec3(0.9, 0.5, 1.0) * pulse * 1.6;
    alpha = 0.9;
  }

  float facing = abs(dot(normalize(vNormalW), normalize(vViewDir)));
  col *= 0.45 + 0.55 * facing;
  alpha *= mix(1.0, 0.5, smoothstep(0.7, 1.0, vH));

  col *= 1.0 + vWake * 0.4;
  col = mix(col, vec3(1.0), vWake * 0.25);
  gl_FragColor = vec4(col, alpha);
}