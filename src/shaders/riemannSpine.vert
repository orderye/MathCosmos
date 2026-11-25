uniform float uJitter;
uniform float uNoiseFreq;

varying vec2 vUv;
varying float vWake;
varying vec3 vNormalW;
varying vec3 vViewDir;

void main() {
  vUv = uv;
  // 体轴归一化：脊柱局部 y ∈ [-600, 600]
  float spineS = clamp((position.y + 600.0) / 1200.0, 0.0, 1.0);
  vec3 localPos = position + leviathanSpineWave(spineS);
  vec3 worldPos = (modelMatrix * vec4(localPos, 1.0)).xyz;
  vec3 nWorld = normalize(mat3(modelMatrix) * normal);

  // 高压电流：低频 + 高频双层 Simplex 沿法线抖动
  float n1 = snoise(worldPos * uNoiseFreq + vec3(0.0, uTime * 0.6, 0.0));
  float n2 = snoise(worldPos * uNoiseFreq * 3.7 - vec3(uTime * 0.9, 0.0, 0.0));
  vec3 displaced = worldPos + nWorld * (n1 * 0.85 + n2 * 0.15) * uJitter;

  float wake;
  displaced = applyProximityWake(displaced, nWorld, wake);
  vWake = wake;
  vNormalW = nWorld;
  vViewDir = cameraPosition - displaced;
  gl_Position = projectionMatrix * viewMatrix * vec4(displaced, 1.0);
}
