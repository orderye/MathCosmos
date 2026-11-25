uniform vec3 uPosColor;
uniform vec3 uNegColor;

varying float vSign;
varying float vAbsY;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vec3 base = vSign > 0.0 ? uPosColor : uNegColor;
  // 节点零面呈半透明暗空
  float node = smoothstep(0.02, 0.35, vAbsY);
  vec3 col = base * (0.2 + 0.8 * node);

  float fres = pow(1.0 - abs(dot(normalize(vNormalW), normalize(vViewDir))), 2.0);
  col += base * fres * 0.8;

  col *= 1.0 + vWake * 0.4;
  col = mix(col, vec3(1.0), vWake * 0.25);
  gl_FragColor = vec4(col * 1.15, 0.92);
}