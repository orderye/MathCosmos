uniform float uDragCoeff;
uniform float uPulsePeriod;
uniform vec3 uLeviathanVel;
uniform vec3 uLeviathanPos;

attribute float aHopDistance;
attribute float aSpineProgress;
attribute float aBranchSeed;
attribute float aTubeRadius;

varying float vH;
varying float vT;
varying float vWake;
varying vec3 vNormalW;
varying vec3 vViewDir;

void main() {
  vH = aHopDistance;
  vT = aSpineProgress;
  float spineS = clamp(aSpineProgress, 0.0, 1.0);

  // 末梢收尖：避免 TubeGeometry 开口平端在近距露出方形断面
  vec3 tapered = position - normal * aTubeRadius * smoothstep(0.75, 1.0, uv.x);
  // 枝条根部跟随脊柱行波，保持与母体连接处不脱节
  tapered += leviathanSpineWave(spineS);

  vec3 worldPos = (modelMatrix * vec4(tapered, 1.0)).xyz;
  vec3 nWorld = normalize(mat3(modelMatrix) * normal);

  // 径向呼吸舒张
  float breath = sin(uTime * 0.9 + spineS * 3.14159265) * (2.5 * aHopDistance);
  // 动作电位脉冲：沿枝条向末梢传导的局部膨胀
  float pulseXi = fract(uTime / uPulsePeriod - spineS);
  float pulse = exp(-pow(pulseXi - aHopDistance, 2.0) / 0.0032) * 1.8;

  // 触手螺旋蜿蜒：绕巨兽径向的切向盘旋
  vec3 radial = worldPos - uLeviathanPos;
  float radialLen = length(radial);
  vec3 radialAxis = radialLen > 0.001 ? radial / radialLen : vec3(0.0, 1.0, 0.0);
  vec3 curlDir = cross(nWorld, radialAxis);
  float curlLen = length(curlDir);
  curlDir = curlLen > 0.001 ? curlDir / curlLen : vec3(0.0, 0.0, 1.0);
  float curl = cos(uTime * 1.15 + aBranchSeed * 6.2831853 + worldPos.y * 0.02)
             * (4.5 * pow(aHopDistance, 1.5));

  // 以太阻力滞后：细神经纤维大幅后披，粗主干近乎刚性
  float drag = -uDragCoeff * aHopDistance * aHopDistance / (1.0 + 2.6 * aTubeRadius);

  vec3 displaced = worldPos
                 + nWorld * (breath + pulse)
                 + curlDir * curl
                 + uLeviathanVel * drag;

  float wake;
  displaced = applyProximityWake(displaced, nWorld, wake);
  vWake = wake;
  vNormalW = nWorld;
  vViewDir = cameraPosition - displaced;
  gl_Position = projectionMatrix * viewMatrix * vec4(displaced, 1.0);
}
