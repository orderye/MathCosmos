// Gyroid TPMS Raymarching（GLSL ES 3.0 / WebGL2）
in vec3 vObjPos;
in vec3 vRo;
in vec4 vClipCorner;
in vec4 vClipCam;

uniform float uTime;
uniform vec3 uDeepColor;
uniform vec3 uTipColor;
uniform vec3 uHaloColor;

out vec4 fragColor;

float gyroid(vec3 p, float t) {
  float k = 2.6;
  vec3 q = p * k;
  float f = sin(q.x) * cos(q.y) + sin(q.y) * cos(q.z) + sin(q.z) * cos(q.x);
  return f - t;
}

float de(vec3 p, float t) {
  float shell = (abs(gyroid(p, t)) - 0.14) / (2.6 * 1.6);
  return max(length(p) - 1.12, shell);
}

vec3 calcNormal(vec3 p, float t) {
  const float e = 0.0025;
  return normalize(vec3(
    de(p + vec3(e, 0.0, 0.0), t) - de(p - vec3(e, 0.0, 0.0), t),
    de(p + vec3(0.0, e, 0.0), t) - de(p - vec3(0.0, e, 0.0), t),
    de(p + vec3(0.0, 0.0, e), t) - de(p - vec3(0.0, 0.0, e), t)
  ));
}

void main() {
  vec3 ro = vRo;
  vec3 rd = normalize(vObjPos - ro);
  float t0 = 0.0;
  float t1 = 1e9;
  {
    vec2 tx = vec2((-1.0 - ro.x) / rd.x, (1.0 - ro.x) / rd.x);
    vec2 ty = vec2((-1.0 - ro.y) / rd.y, (1.0 - ro.y) / rd.y);
    vec2 tz = vec2((-1.0 - ro.z) / rd.z, (1.0 - ro.z) / rd.z);
    t0 = max(t0, max(max(min(tx.x, tx.y), min(ty.x, ty.y)), min(tz.x, tz.y)));
    t1 = min(t1, min(min(max(tx.x, tx.y), max(ty.x, ty.y)), max(tz.x, tz.y)));
  }
  if (t0 > t1) discard;

  float t = t0;
  float wave = 0.25 * sin(0.5 * uTime);
  bool hit = false;
  vec3 hp = vec3(0.0);
  float steps = 0.0;
  for (int i = 0; i < 64; i++) {
    vec3 p = ro + rd * t;
    float d = de(p, wave);
    steps += 1.0;
    if (d < 0.0018) {
      hit = true;
      hp = p;
      break;
    }
    t += max(d * 0.75, 0.0015);
    if (t > t1 + 0.2) break;
  }
  if (!hit) discard;

  vec3 nrm = calcNormal(hp, wave);
  float ao = 1.0 - steps / 64.0;
  float fresnel = pow(1.0 - max(dot(nrm, -rd), 0.0), 2.2);
  float depthShade = clamp(length(hp) * 0.9, 0.0, 1.0);
  vec3 col = mix(uDeepColor, uHaloColor, depthShade);
  col = col * (0.35 + 0.85 * ao) + uTipColor * fresnel * 1.35;

  float travel = length(hp - ro) / max(length(vObjPos - ro), 1e-5);
  vec4 clip = mix(vClipCam, vClipCorner, travel);
  gl_FragDepth = (clip.z / clip.w) * 0.5 + 0.5;
  fragColor = vec4(col, 1.0);
}
