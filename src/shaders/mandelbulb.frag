// 曼德博球 Raymarching 距离估计（GLSL ES 3.0 / WebGL2，gl_FragDepth 参与深度遮挡）
in vec3 vObjPos;
in vec3 vRo;
in vec4 vClipCorner;
in vec4 vClipCam;

uniform float uTime;
uniform vec3 uDeepColor;
uniform vec3 uTipColor;
uniform vec3 uHaloColor;

out vec4 fragColor;

float de(vec3 pos, out float trap) {
  vec3 z = pos;
  float dr = 1.0;
  float r = 0.0;
  float n = 7.5 + 1.2 * sin(0.3 * uTime);
  trap = 1e9;
  for (int i = 0; i < 8; i++) {
    r = length(z);
    if (r > 2.0) break;
    float theta = acos(clamp(z.z / r, -1.0, 1.0));
    float phi = atan(z.y, z.x);
    dr = pow(r, n - 1.0) * n * dr + 1.0;
    float zr = pow(r, n);
    theta *= n;
    phi *= n;
    z = zr * vec3(sin(theta) * cos(phi), sin(phi) * sin(theta), cos(theta)) + pos;
    trap = min(trap, length(z.xy));
  }
  return 0.5 * log(max(r, 1.000001)) * dr / r;
}

void main() {
  vec3 ro = vRo;
  vec3 rd = normalize(vObjPos - ro);

  // 从射线-包围盒入射点起步进，否则 48 步预算走不到分形表面
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
  float trapMin = 1e9;
  float steps = 0.0;
  bool hit = false;
  vec3 hp = vec3(0.0);

  for (int i = 0; i < 48; i++) {
    vec3 p = ro + rd * t;
    float tr;
    float d = de(p, tr);
    trapMin = min(trapMin, tr);
    steps += 1.0;
    if (d < 0.003) {
      hit = true;
      hp = p;
      break;
    }
    // 迭代数偏少时 DE 高估距离，保守步长防止穿透薄壳
    t += max(d * 0.5, 0.002);
    if (t > t1 + 0.3) break;
  }

  if (hit) {
    vec2 e = vec2(0.0012, 0.0);
    float tr;
    vec3 nrm = normalize(vec3(
      de(hp + e.xyy, tr) - de(hp - e.xyy, tr),
      de(hp + e.yxy, tr) - de(hp - e.yxy, tr),
      de(hp + e.yyx, tr) - de(hp - e.yyx, tr)
    ));
    float ao = clamp(1.0 - steps / 48.0, 0.2, 1.0);
    float diff = 0.55 + 0.45 * clamp(dot(nrm, normalize(ro - hp)), 0.0, 1.0);
    vec3 col = mix(uDeepColor, uTipColor, clamp(trapMin * 1.5, 0.0, 1.0));
    col *= ao * diff * 1.35;

    // clip 沿世界线段线性：按命中参数在相机/盒角两个 clip 间插值
    float u = length(hp - ro) / max(length(vObjPos - ro), 1e-5);
    vec4 clip = mix(vClipCam, vClipCorner, u);
    gl_FragDepth = (clip.z / clip.w) * 0.5 + 0.5;
    fragColor = vec4(col, 1.0);
  } else {
    float halo = exp(-trapMin * trapMin * 6.0) * 0.15;
    if (halo < 0.03) discard;
    fragColor = vec4(uHaloColor * halo, halo);
  }
}