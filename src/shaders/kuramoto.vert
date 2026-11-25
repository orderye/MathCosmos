uniform float uTime;
uniform float uSize;

attribute float aPhase;

varying float vPulse;

void main() {
  float pulse = pow(0.5 + 0.5 * cos(aPhase), 3.0);
  vPulse = pulse;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vec4 mv = viewMatrix * world;
  gl_PointSize = clamp(uSize * (0.45 + pulse * 1.4) * (320.0 / max(-mv.z, 1.0)), 1.5, 28.0);
  gl_Position = projectionMatrix * mv;
}
