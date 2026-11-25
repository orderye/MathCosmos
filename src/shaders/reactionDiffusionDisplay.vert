uniform sampler2D uState;
uniform float uDisplace;

varying vec2 vUv;
varying float vDisp;
varying vec3 vNormalW;
varying vec3 vViewDir;

void main() {
  vUv = uv;
  float v = texture2D(uState, uv).g;
  vDisp = v;
  vec3 local = position + normal * (v - 0.35) * uDisplace;
  vec4 world = modelMatrix * vec4(local, 1.0);
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vViewDir = cameraPosition - world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
