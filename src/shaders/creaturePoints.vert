uniform float uTime;
uniform float uSize;

attribute float aSpeed;
attribute float aPhase;

varying float vSpeed;
varying float vWake;

void main() {
  vSpeed = aSpeed;
  vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;

  float wake;
  worldPos = applyProximityWake(worldPos, normalize(worldPos + vec3(0.001)), wake);
  vWake = wake;

  vec4 mv = viewMatrix * vec4(worldPos, 1.0);
  float breathe = 0.75 + 0.25 * sin(uTime * 3.0 + aPhase * 6.2831);
  gl_PointSize = uSize * breathe * (400.0 / max(-mv.z, 1.0));
  gl_Position = projectionMatrix * mv;
}