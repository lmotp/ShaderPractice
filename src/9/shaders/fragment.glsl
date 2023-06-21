uniform float uTime;
uniform vec2 resolution;

varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

float noise(in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  vec2 i2 = i + vec2(1.0,0.0);
  vec2 i3 = i + vec2(0.0,1.0);
  vec2 i4 = i + vec2(1.0,1.0);

  float r1 = random(i);
  float r2 = random(i2);
  float r3 = random(i3);
  float r4 = random(i4);

  f = f * f * f * (f * (f * 6.0 - 15.) + 10.);

  float bot = mix(r1,r2,f.x);
  float top = mix(r3,r4,f.x);
  float result = mix(bot,top,f.y);

  return result;
}


void main() {
  vec2 coord = vUv;
  coord *= 10.;

  vec3 col = vec3(noise(coord));

  gl_FragColor = vec4(col,1.0);
}