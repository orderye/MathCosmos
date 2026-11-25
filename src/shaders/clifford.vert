attribute vec4 aPos4D;

uniform float uTime;
uniform float uProjDist;

varying vec2 vUv;
varying float vDepth4D;
varying vec3 vWorldPos;
varying vec3 vViewDir;

void main() {
  vUv = uv;
  vec4 p = aPos4D;

  float a1 = uTime * 0.35;
  vec2 xw = mat2(cos(a1), -sin(a1), sin(a1), cos(a1)) * vec2(p.x, p.w);
  p.x = xw.x;
  p.w = xw.y;

  float a2 = uTime * 0.23;
  vec2 zw = mat2(cos(a2), -sin(a2), sin(a2), cos(a2)) * vec2(p.z, p.w);
  p.z = zw.x;
  p.w = zw.y;

  float inv = uProjDist / max(0.35, uProjDist - p.w);
  vec3 pos3D = p.xyz * inv * 0.62;
  vec4 world = modelMatrix * vec4(pos3D, 1.0);
  vDepth4D = clamp(p.w * 0.5 + 0.5, 0.0, 1.0);
  vWorldPos = world.xyz;
  vViewDir = cameraPosition - world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
