uniform vec3 uCoreColor;
uniform vec3 uGlowColor;

varying float vSpeed;
varying float vWake;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d2 = dot(c, c);
  if (d2 > 0.25) discard;
  float soft = 1.0 - d2 * 4.0;

  vec3 col = mix(uGlowColor, uCoreColor, clamp(vSpeed, 0.0, 1.0));
  col *= soft * (1.0 + vWake * 0.6);
  gl_FragColor = vec4(col, soft * 0.9);
}