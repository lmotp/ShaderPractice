uniform float uTime;
uniform float uWaveLength;
uniform vec2 uMouse;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  float vWave = sin(uTime + (position.x + position.y) * uWaveLength);
  vec4 defaultPosition = vec4(
    position.x + uMouse.y * 0.02,
    position.y + uMouse.x * 0.02,
    vWave * 0.04,
    1.0
  );

  gl_Position = projectionMatrix * modelViewMatrix * defaultPosition;

  vUv = uv;
  vPosition = position;
}