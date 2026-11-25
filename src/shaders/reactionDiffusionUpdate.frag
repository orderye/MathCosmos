uniform sampler2D uState;
uniform vec2 uTexel;
uniform float uFeed;
uniform float uKill;

varying vec2 vUv;

void main() {
  vec2 c = vUv;
  vec4 st = texture2D(uState, c);
  float u = st.r;
  float v = st.g;

  float lu = -u;
  float lv = -v;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      if (x == 0 && y == 0) continue;
      vec2 o = vec2(float(x), float(y)) * uTexel;
      vec4 s = texture2D(uState, c + o);
      float w = (x == 0 || y == 0) ? 0.2 : 0.05;
      lu += s.r * w;
      lv += s.g * w;
    }
  }

  float du = 0.21;
  float dv = 0.105;
  float reaction = u * v * v;
  float nu = u + (du * lu - reaction + uFeed * (1.0 - u));
  float nv = v + (dv * lv + reaction - (uFeed + uKill) * v);
  gl_FragColor = vec4(clamp(nu, 0.0, 1.0), clamp(nv, 0.0, 1.0), 0.0, 1.0);
}
