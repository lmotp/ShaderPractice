varying vec2 vUv;

void main() {
  vec4 defaultPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = 10. * (1. / -defaultPosition.z);
  gl_Position = projectionMatrix * defaultPosition;

  vUv = uv;
}