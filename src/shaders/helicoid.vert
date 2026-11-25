uniform float uTime;
uniform float uMorphScale;

varying vec2 vUv;
varying float vPhase;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vWake;

void main() {
  vUv = uv;
  float u = mix(-1.6, 1.6, uv.x);
  float v = mix(-3.14159265, 3.14159265, uv.y);
  float alpha = 0.45 * uTime;
  float ca = cos(alpha);
  float sa = sin(alpha);
  float shu = sinh(u);
  float chu = cosh(u);
  float sv = sin(v);
  float cv = cos(v);

  vec3 pos = vec3(
    ca * shu * sv + sa * chu * cv,
    -ca * shu * cv + sa * chu * sv,
    v * ca + u * sa
  );

  // 解析切向量叉乘得到精确法线
  vec3 ru = vec3(
    ca * chu * sv + sa * shu * cv,
    -ca * chu * cv + sa * shu * sv,
    sa
  );
  vec3 rv = vec3(
    ca * shu * cv - sa * chu * sv,
    ca * shu * sv + sa * chu * cv,
    ca
  );
  vec3 n = normalize(cross(ru, rv));
  vec4 world = modelMatrix * vec4(pos * uMorphScale, 1.0);
  vec3 nWorld = normalize(mat3(modelMatrix) * n);
  float wake;
  world.xyz = applyProximityWake(world.xyz, nWorld, wake);
  vWake = wake;
  vNormalW = nWorld;
  vViewDir = cameraPosition - world.xyz;
  vPhase = sa * sa;
  gl_Position = projectionMatrix * viewMatrix * world;
}
