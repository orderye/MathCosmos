uniform float uTime;
uniform float uBreathAmp;
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

attribute float aInstanceScalar;
attribute float aPhase;

varying float vScalar;
varying float vPhase;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vUv = uv;
  vScalar = aInstanceScalar;
  vPhase = aPhase;

  vec3 center = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  float radial = length(center);
  vec3 dir = radial > 0.001 ? center / radial : vec3(0.0, 1.0, 0.0);
  vec3 local = position + dir * sin(uTime * 1.2 - 2.0 * radial + aPhase * 6.2831) * uBreathAmp;

  vec4 world = modelMatrix * instanceMatrix * vec4(local, 1.0);
  vec3 nWorld = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
  float wake;
  world.xyz = applyProximityWake(world.xyz, nWorld, wake);
  vWake = wake;
  vNormalW = nWorld;
  vViewDir = cameraPosition - world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
