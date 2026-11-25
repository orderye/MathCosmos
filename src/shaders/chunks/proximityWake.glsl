// 玩家“擦肩而过”流体尾流扰动公共片（主文档 §5.2）
uniform vec3 uPlayerPos;
uniform vec3 uPlayerVel;
uniform float uWakeRadius;

vec3 applyProximityWake(vec3 worldPos, vec3 normal, out float wakeIntensity) {
    vec3 toVertex = worldPos - uPlayerPos;
    float dist = length(toVertex);
    float speedFactor = clamp(length(uPlayerVel) / 120.0, 0.25, 2.0);

    wakeIntensity = smoothstep(uWakeRadius, 0.0, dist);
    vec3 pushDir = normalize(toVertex + vec3(0.0001));
    vec3 swirlDir = normalize(cross(pushDir, normalize(uPlayerVel + vec3(0.0, 0.001, 0.0))));

    float displacement = wakeIntensity * wakeIntensity * 6.5 * speedFactor;
    return worldPos + (pushDir * 0.7 + swirlDir * 0.3) * displacement;
}