attribute vec4 aPos4D;

uniform float uTime;
uniform float uProjDist;
uniform float uScale;
uniform float uSize;

varying float vDepth4D;
varying vec2 vUv;

void main() {
  vUv = vec2(0.0);
  vec4 p = aPos4D;
  float a1 = uTime * 0.42;
  vec2 xw = mat2(cos(a1), -sin(a1), sin(a1), cos(a1)) * vec2(p.x, p.w);
  p.x = xw.x;
  p.w = xw.y;
  float a2 = uTime * 0.29;
  vec2 yz = mat2(cos(a2), -sin(a2), sin(a2), cos(a2)) * vec2(p.y, p.z);
  p.y = yz.x;
  p.z = yz.y;

  float invDenom = uProjDist / max(0.35, uProjDist - p.w);
  vec3 pos3D = p.xyz * invDenom * uScale;
  vDepth4D = clamp(p.w * 0.5 + 0.5, 0.0, 1.0);
  vec4 mv = modelViewMatrix * vec4(pos3D, 1.0);
  gl_PointSize = clamp(uSize * (1.0 + vDepth4D * 1.5) * (300.0 / max(-mv.z, 1.0)), 2.0, 26.0);
  gl_Position = projectionMatrix * mv;
}
