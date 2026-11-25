// 尘埃场顶点着色器：mod 空间折叠包裹玩家 + 曲速星轨拉伸
// 实例偏移量为静态逻辑坐标，uPlayerPos 亦为逻辑坐标 → 浮动原点重置零跳变
uniform vec3 uPlayerPos;
uniform vec3 uPlayerVel;
uniform vec3 uWorldOffset;
uniform float uTime;
uniform float uViewportHeight;

attribute float aSeed;
attribute float aBright;

varying float vBright;
varying float vFade;
varying float vAxis;

const float BOX = 4000.0;
const float HALF = 2000.0;

void main() {
  vec3 center = mod(instanceMatrix[3].xyz - uPlayerPos + HALF, BOX) - HALF + uPlayerPos;

  float speed = length(uPlayerVel);
  vec3 dir = speed > 1.0 ? uPlayerVel / speed : vec3(0.0, 0.0, 1.0);
  // §1.3：|v| > 160 时沿速度方向拉长至 1 + 4.5 * (|v|-160)/300 倍
  float stretch = 1.0 + 4.5 * clamp((speed - 160.0) / 300.0, 0.0, 1.0);

  // 屏幕空间恒定 ~1.15px 线宽：按距离反推世界宽度，避免远距亚像素不可见
  float dist = length(center - uPlayerPos);
  float widthWorld = dist * 1.5 / (0.5 * uViewportHeight * projectionMatrix[1][1]);
  vec3 widthVec = mat3(instanceMatrix) * vec3(position.x, position.y, 0.0) * (widthWorld / 0.16);
  vec3 lengthVec = mat3(instanceMatrix) * vec3(0.0, 0.0, position.z);
  // 曲速时线段整体转向速度矢量并拉长，形成放射星轨
  float align = clamp((speed - 160.0) / 300.0, 0.0, 1.0);
  float lenZ = length(instanceMatrix[2].xyz);
  vec3 streakVec = dir * (position.z * lenZ * stretch);
  vec3 shaped = widthVec + mix(lengthVec, streakVec, align);

  vec3 renderPos = center + shaped - uWorldOffset;
  vec4 mvPosition = modelViewMatrix * vec4(renderPos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float edgeFade = 1.0 - smoothstep(1500.0, 1990.0, dist);
  float twinkle = 0.85 + 0.15 * sin(uTime * (0.4 + aSeed) + aSeed * 40.0);
  vBright = aBright * twinkle;
  vFade = edgeFade;
  vAxis = position.z;
}