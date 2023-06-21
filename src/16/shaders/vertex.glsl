uniform float uTime;
uniform vec2 uMouse;

varying vec2 vUv;

void main() {
  vec4 defaultPosition = vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * defaultPosition;

  vUv = uv;
}