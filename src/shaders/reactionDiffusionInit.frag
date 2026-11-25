varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 cell = floor(vUv * 64.0);
  float n = hash(cell);
  float v = step(0.9, n) * 0.9;
  gl_FragColor = vec4(1.0, v, 0.0, 1.0);
}
