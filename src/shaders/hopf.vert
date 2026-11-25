uniform float uTime;

attribute float aHue;

varying float vHue;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vHue = aHue;
  vUv = uv;
  vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  vec3 nWorld = normalize(mat3(modelMatrix) * normal);

  float wake;
  worldPos = applyProximityWake(worldPos, nWorld, wake);
  vWake = wake;
  vNormalW = nWorld;
  vViewDir = cameraPosition - worldPos;
  gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
}