uniform float uTime;
uniform float uL1;
uniform float uM1;
uniform float uL2;
uniform float uM2;

varying float vSign;
varying float vAbsY;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

// 缔合勒让德 P_l^m(x)（l ≤ 5；ES 1.0 要求常量循环边界 + break）
float plm(int l, int m, float x) {
  if (m > l) return 0.0;
  float pmm = 1.0;
  if (m > 0) {
    float somx2 = sqrt(max(0.0, (1.0 - x) * (1.0 + x)));
    float fact = 1.0;
    for (int i = 0; i < 6; i++) {
      if (i >= m) break;
      pmm *= -fact * somx2;
      fact += 2.0;
    }
  }
  if (l == m) return pmm;
  float pmmp1 = x * (2.0 * float(m) + 1.0) * pmm;
  if (l == m + 1) return pmmp1;
  for (int llStep = 0; llStep < 6; llStep++) {
    int ll = m + 2 + llStep;
    if (ll > l) break;
    float pl = (x * (2.0 * float(ll) - 1.0) * pmmp1 - (float(ll) + float(m) - 1.0) * pmm) / (float(ll) - float(m));
    pmm = pmmp1;
    pmmp1 = pl;
  }
  return pmmp1;
}

float realY(float l, float m, vec3 dir) {
  float theta = acos(clamp(dir.y, -1.0, 1.0));
  float phi = atan(dir.z, dir.x);
  int li = int(l);
  int mi = int(abs(m));
  float p = plm(li, mi, cos(theta));
  return p * (m >= 0.0 ? cos(float(mi) * phi) : sin(float(mi) * phi));
}

void main() {
  vec3 dir = normalize(position);
  float k = 0.5 + 0.5 * sin(uTime * 0.25);
  float y = mix(realY(uL1, uM1, dir), realY(uL2, uM2, dir), k);
  float r = 0.55 + 0.85 * min(abs(y) * 0.9, 1.6);
  vec3 localPos = dir * r;

  vSign = sign(y);
  vAbsY = min(abs(y) * 0.9, 1.6);

  vec3 worldPos = (modelMatrix * vec4(localPos, 1.0)).xyz;
  vec3 nWorld = normalize(mat3(modelMatrix) * dir);

  float wake;
  worldPos = applyProximityWake(worldPos, nWorld, wake);
  vWake = wake;
  vNormalW = nWorld;
  vViewDir = cameraPosition - worldPos;
  gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
}