// 四元数茱莉亚集 Raymarching（GLSL ES 3.0 / WebGL2）
in vec3 vObjPos;
in vec3 vRo;
in vec4 vClipCorner;
in vec4 vClipCam;

uniform float uTime;
uniform vec3 uDeepColor;
uniform vec3 uTipColor;
uniform vec3 uHaloColor;

out vec4 fragColor;

vec4 qSqr(vec4 q) {
  return vec4(q.x * q.x - dot(q.yzw, q.yzw), 2.0 * q.x * q.yzw);
}

vec2 mapJulia(vec3 p, vec4 c) {
  vec4 z = vec4(p, 0.0);
  float dz = 1.0;
  float trap = 1e5;
  for (int i = 0; i < 10; i++) {
    dz = 2.0 * length(z) * dz;
    z = qSqr(z) + c;
    float r2 = dot(z, z);
    trap = min(trap, length(z.xyz - vec3(0.25, 0.15, 0.1)));
    if (r2 > 16.0) break;
  }
  float r = length(z);
  float de = 0.5 * r * log(max(r, 1.0001)) / max(dz, 1e-5);
  return vec2(de, trap);
}

vec3 calcNormal(vec3 p, vec4 c) {
  const float eps = 0.0025;
  vec2 k = vec2(1.0, -1.0);
  return normalize(
    k.xyy * mapJulia(p + k.xyy * eps, c).x +
    k.yyx * mapJulia(p + k.yyx * eps, c).x +
    k.yxy * mapJulia(p + k.yxy * eps, c).x +
    k.xxx * mapJulia(p + k.xxx * eps, c).x
  );
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

  vec4 cParam = vec4(
    -0.2 + 0.15 * cos(0.4 * uTime),
     0.6 + 0.12 * sin(0.4 * uTime),
     0.2 * sin(0.25 * uTime),
     0.15 * cos(0.3 * uTime)
  );

  float t = t0;
  bool hit = false;
  vec3 hp = vec3(0.0);
  float trapVal = 1.0;
  float steps = 0.0;

  for (int i = 0; i < 56; i++) {
    vec3 p = ro + rd * t;
    vec2 res = mapJulia(p, cParam);
    trapVal = res.y;
    steps += 1.0;
    if (res.x < 0.0018 * (1.0 + t * 0.4)) {
      hit = true;
      hp = p;
      break;
    }
    t += max(res.x * 0.8, 0.0015);
    if (t > t1 + 0.2) break;
  }
  if (!hit) discard;

  vec3 normal = calcNormal(hp, cParam);
  float ao = 1.0 - steps / 56.0;
  float fresnel = pow(1.0 - max(dot(normal, -rd), 0.0), 2.4);
  vec3 col = mix(uDeepColor, uHaloColor, clamp(trapVal * 1.4, 0.0, 1.0));
  col = col * (0.3 + 0.9 * ao) + uTipColor * fresnel * 1.2;

  float travel = length(hp - ro) / max(length(vObjPos - ro), 1e-5);
  vec4 clip = mix(vClipCam, vClipCorner, travel);
  gl_FragDepth = (clip.z / clip.w) * 0.5 + 0.5;
  fragColor = vec4(col, 1.0);
}
