uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

varying float vSign;
varying float vProb;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d2 = dot(c, c);
  if (d2 > 0.25) discard;
  float soft = 1.0 - d2 * 4.0;
  vec3 col = vSign >= 0.0 ? mix(uGlowColor, uCoreColor, vProb) : mix(uAccentColor, uCoreColor, vProb * 0.7);
  gl_FragColor = vec4(col * soft * (0.35 + vProb * 1.5), soft * (0.3 + vProb * 0.6));
}
