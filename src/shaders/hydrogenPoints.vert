uniform float uTime;
uniform float uSize;
uniform float uOrbitalM;

attribute float aPhaseSign;
attribute float aProb;

varying float vSign;
varying float vProb;

void main() {
  vSign = aPhaseSign;
  vProb = aProb;
  float angle = uTime * (0.18 + abs(uOrbitalM) * 0.08);
  float c = cos(angle);
  float s = sin(angle);
  vec3 p = vec3(c * position.x - s * position.z, position.y, s * position.x + c * position.z);
  vec4 world = modelMatrix * vec4(p, 1.0);
  vec4 mv = viewMatrix * world;
  float breathe = 0.7 + 0.3 * sin(uTime * 1.7 + aProb * 9.0);
  gl_PointSize = clamp(uSize * (0.45 + aProb * 1.4) * breathe * (300.0 / max(-mv.z, 1.0)), 1.2, 22.0);
  gl_Position = projectionMatrix * mv;
}
