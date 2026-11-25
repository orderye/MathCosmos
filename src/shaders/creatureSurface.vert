uniform float uTime;
uniform float uWaveAmp;
uniform float uWaveFreq;

varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vWorldNormal;
varying float vWake;

void main() {
  vUv = uv;
  vec3 local = position;
  local += normal * sin(uTime * uWaveFreq + uv.x * 12.566 + uv.y * 6.283) * uWaveAmp;

  vec4 world = modelMatrix * vec4(local, 1.0);
  vec3 wNormal = normalize(mat3(modelMatrix) * normal);
  float wake;
  world.xyz = applyProximityWake(world.xyz, wNormal, wake);
  vWake = wake;
  vWorldPos = world.xyz;
  vWorldNormal = wNormal;
  gl_Position = projectionMatrix * viewMatrix * world;
}
