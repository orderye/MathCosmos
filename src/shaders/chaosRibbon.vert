uniform float uTime;
uniform float uFlowSpeed;

attribute float aProgress;
attribute float aDistance;

varying float vProgress;
varying float vDistance;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vProgress = aProgress;
  vDistance = aDistance;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vec3 nWorld = normalize(mat3(modelMatrix) * normal);
  float wake;
  world.xyz = applyProximityWake(world.xyz, nWorld, wake);
  vWake = wake;
  vNormalW = nWorld;
  vViewDir = cameraPosition - world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
