uniform float uTime;
uniform float uFlowSpeed;
uniform vec2 uGridFreq;
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vWorldNormal;
varying float vWake;

float computeGrid(vec2 uv, vec2 freq, float lineWidth) {
  vec2 coord = uv * freq;
  vec2 grid = abs(fract(coord - 0.5) - 0.5) / (fwidth(coord) + 1e-5);
  float line = min(grid.x, grid.y);
  return 1.0 - smoothstep(0.0, lineWidth, line);
}

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  vec3 normal = gl_FrontFacing ? normalize(vWorldNormal) : -normalize(vWorldNormal);

  float fresnel = pow(1.0 - clamp(abs(dot(viewDir, normal)), 0.0, 1.0), 2.6);
  float wave = 0.5 + 0.5 * sin(vUv.x * 12.566 - uTime * uFlowSpeed + vUv.y * 6.283);
  float gridMask = computeGrid(vUv + vec2(uTime * 0.03, 0.0), uGridFreq, 1.35);

  vec3 baseTint = mix(uGlowColor, uAccentColor, wave);
  vec3 color = baseTint * (0.28 + fresnel * 1.45);
  color += mix(uGlowColor, uCoreColor, 0.65) * gridMask * (0.45 + 0.55 * fresnel);
  color += uCoreColor * vWake * 1.15;

  float alpha = clamp(0.16 + fresnel * 0.65 + gridMask * 0.35 + vWake * 0.3, 0.0, 0.95);
  gl_FragColor = vec4(color, alpha);
}
