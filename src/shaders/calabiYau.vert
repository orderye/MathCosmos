// 卡拉比-丘五次流形：四维坐标经旋转角 α(t)=0.35·uTime 实时投影至三维
uniform float uTime;

attribute float aImagZ1;
attribute float aImagZ2;

varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  float alpha = 0.35 * uTime;
  vec3 projected = vec3(
    position.x,
    position.y,
    cos(alpha) * aImagZ1 + sin(alpha) * aImagZ2
  );
  vUv = uv;

  vec3 worldPos = (modelMatrix * vec4(projected, 1.0)).xyz;
  vec3 nWorld = normalize(mat3(modelMatrix) * normal);

  float wake;
  worldPos = applyProximityWake(worldPos, nWorld, wake);
  vWake = wake;
  vNormalW = nWorld;
  vViewDir = cameraPosition - worldPos;
  gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
}