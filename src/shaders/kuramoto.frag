uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

varying float vPulse;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d2 = dot(c, c);
  if (d2 > 0.25) discard;
  float soft = 1.0 - d2 * 4.0;
  vec3 col = mix(uGlowColor, uAccentColor, vPulse);
  col = mix(col, uCoreColor, pow(vPulse, 2.0) * 0.8);
  gl_FragColor = vec4(col * soft * (0.55 + vPulse * 1.4), soft * (0.35 + vPulse * 0.65));
}
