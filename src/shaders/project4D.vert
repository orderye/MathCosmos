attribute vec4 aPos4D;

uniform float uTime;
uniform float uProjDist;
uniform float uScale;

varying float vDepth4D;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 p = aPos4D;
  float a1 = uTime * 0.42;
  float c1 = cos(a1);
  float s1 = sin(a1);
  vec2 xw = mat2(c1, -s1, s1, c1) * vec2(p.x, p.w);
  p.x = xw.x;
  p.w = xw.y;

  float a2 = uTime * 0.29;
  float c2 = cos(a2);
  float s2 = sin(a2);
  vec2 yz = mat2(c2, -s2, s2, c2) * vec2(p.y, p.z);
  p.y = yz.x;
  p.z = yz.y;

  float invDenom = uProjDist / max(0.35, uProjDist - p.w);
  vec3 pos3D = p.xyz * invDenom * uScale;
  vDepth4D = clamp(p.w * 0.5 + 0.5, 0.0, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos3D, 1.0);
}
