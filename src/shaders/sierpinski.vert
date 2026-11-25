// instanceMatrix 由 three 在 USE_INSTANCING 前缀中自动声明
attribute float aInstDist;

uniform float uTime;

varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vUv = uv;
  vec4 instanced = instanceMatrix * vec4(position, 1.0);
  // 距几何中心越远，呼吸膨胀相位越滞后（离散搏动感）
  float breath = sin(uTime * 1.6 - aInstDist * 3.4) * 0.035;
  instanced.xyz *= 1.0 + breath;

  vec3 worldPos = (modelMatrix * instanced).xyz;
  vec3 nWorld = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);

  float wake;
  worldPos = applyProximityWake(worldPos, nWorld, wake);
  vWake = wake;
  vNormalW = nWorld;
  vViewDir = cameraPosition - worldPos;
  gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
}