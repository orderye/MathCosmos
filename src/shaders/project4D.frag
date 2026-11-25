uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

varying float vDepth4D;
varying vec2 vUv;

void main() {
  vec3 col = mix(uGlowColor, uAccentColor, vDepth4D);
  col = mix(col, uCoreColor, pow(vDepth4D, 3.0) * 0.75);
  gl_FragColor = vec4(col, 0.35 + 0.55 * vDepth4D);
}
