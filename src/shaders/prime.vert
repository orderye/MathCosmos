uniform float uTime;
uniform float uSweep;
uniform vec3 uPlayerPos;
uniform float uWakeRadius;

attribute float aIndex;
attribute float aPrime;
attribute float aParity;

varying float vPrime;
varying float vFlash;
varying float vParity;

void main() {
  vPrime = aPrime;
  vParity = aParity;

  // 每 3 秒自 n=0 扫过的素数筛检光波
  float d = aIndex - uSweep;
  vFlash = aPrime * exp(-d * d * 0.0022) * (0.6 + 0.4 * sin(uTime * 9.0));

  vec3 localPos = position * mix(0.85, 2.5, aPrime);
  vec4 instanced = instanceMatrix * vec4(localPos, 1.0);
  vec3 worldPos = (modelMatrix * instanced).xyz;

  vec3 toPlayer = worldPos - uPlayerPos;
  float dist = length(toPlayer);
  float wake = smoothstep(uWakeRadius, 0.0, dist);
  worldPos += normalize(toPlayer + vec3(0.001)) * wake * wake * 4.0;

  gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
}