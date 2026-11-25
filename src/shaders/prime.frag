uniform vec3 uTealColor;
uniform vec3 uYellowColor;
uniform vec3 uDimColor;

varying float vPrime;
varying float vFlash;
varying float vParity;

void main() {
  vec3 primeCol = vParity < 0.5 ? uTealColor : uYellowColor;
  vec3 col = mix(uDimColor, primeCol, vPrime);
  col += primeCol * vFlash * 1.8;
  float alpha = mix(0.35, 0.95, vPrime);
  gl_FragColor = vec4(col * 1.4, alpha);
}