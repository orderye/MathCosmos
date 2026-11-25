out vec3 vObjPos;
out vec3 vRo;
out vec4 vClipCorner;
out vec4 vClipCam;

void main() {
  vObjPos = position;
  // 片元阶段无 modelMatrix/inverse：相机射线原点与两端 clip 坐标在顶点期算好
  vRo = (inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz;
  vClipCorner = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vClipCam = projectionMatrix * viewMatrix * vec4(cameraPosition, 1.0);
  gl_Position = vClipCorner;
}