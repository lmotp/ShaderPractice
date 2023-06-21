uniform float uTime;
uniform vec2 resolution;

varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

<<<<<<< HEAD
float whiteNoise2x1(vec2 st) {
  float ret = fract(sin(dot(st, vec2(12.989,78.233))) * 43758.5453);
  return ret;
}

float valueNoiseFn(vec2 st) {
  vec2 gridUv = fract(st);
  vec2 gridId = floor(st);

  gridUv = smoothstep(0.0,1.0,gridUv);

  float botLeft = whiteNoise2x1(gridId);
  float botRight = whiteNoise2x1(gridId + vec2(1.0,0.0));
  float b = mix(botLeft,botRight,gridUv.x);
  
  float topLeft = whiteNoise2x1(gridId + vec2(0.0, 1.0));
  float topRight = whiteNoise2x1(gridId + vec2(1.0,1.0));
  float t = mix(topLeft,topRight,gridUv.x);
  
  float noise = mix(b,t,gridUv.y);

  return noise;
}


void main(){
  vec2 coord = vUv;
  vec3 color = vec3(1.0);
  color = vec3(whiteNoise2x1(coord));
  coord *= 8.0;

  vec2 gridUv = fract(coord);
  gridUv = smoothstep(0.0,1.0,gridUv);
  color = vec3(gridUv,0.0);

  // 전체 너비를 0 ~ 1 > 0 ~ 8로 수정하고, 각 수의 소수점을 제거하면 자연수만 0 ~ 8인데 1을 넘어가기 때문에 1로 적용됨.
  // 그 값을 1을 기준으로 너비값을 적당히 나눠주면 계층이 생김.
  vec2 gridId = floor(coord);
  color = vec3(gridId, 0.0) * 0.25;

  float botLeft = whiteNoise2x1(gridId);
  float botRight = whiteNoise2x1(gridId + vec2(1.0,0.0));
  float b = mix(botLeft,botRight,gridUv.x);
  
  float topLeft = whiteNoise2x1(gridId + vec2(0.0, 1.0));
  float topRight = whiteNoise2x1(gridId + vec2(1.0,1.0));
  float t = mix(topLeft,topRight,gridUv.x);
  color = vec3(t);

  coord += uTime / 10.0;
  float vn = valueNoiseFn(coord);
  vn += valueNoiseFn(coord * 4.0) * 1.0;
  vn += valueNoiseFn(coord * 8.0) * 0.5;
  vn += valueNoiseFn(coord * 16.0) * 0.25;
  vn += valueNoiseFn(coord * 32.0) * 0.125;
  vn += valueNoiseFn(coord * 64.0) * 0.0625;
  vn /= 2.0;
  color = vec3(vn);

  color = mix(vec3(0.0392, 0.0824, 0.6745), vec3(1.0, 0.6235, 0.7176),vec3(vn));

  gl_FragColor = vec4(color, 1.0);
=======
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
>>>>>>> 416bcaaa0d185f2d60741484a020902004b91bfa
}