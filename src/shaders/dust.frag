// 尘埃场片元着色器：暗灰紫短线段，两端柔和淡出，亮度远低于 Bloom 阈值 0.85
uniform vec3 uDustColor;

varying float vBright;
varying float vFade;
varying float vAxis;

void main() {
  float endFade = 1.0 - smoothstep(0.28, 0.5, abs(vAxis));
  float alpha = vBright * vFade * endFade;
  gl_FragColor = vec4(uDustColor * alpha, alpha);
}