varying vec2 vUv;
uniform float uTime;

attribute float aRandom;

void main() {
  vec3 pos = position;
  pos += aRandom *(sin(uTime) * 0.5 + 0.5)* normal;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);

  vUv = uv;
}