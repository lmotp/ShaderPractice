uniform float uTime;
uniform vec2 resolution;

varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

vec3 palette(float f) {
  vec3 a = vec3(0.5,0.5,0.5);
  vec3 b = vec3(0.5,0.5,0.5);
  vec3 c = vec3(1.0,1.0,1.0);
  vec3 d = vec3(0.263,0.416,0.557);

  return a + b * cos(6.28318 * (c * f + d));
}

void main() {
  vec2 newUV = vUv - 0.5;
  vec2 coord = vUv * 2.0;
  vec3 finalColor = vec3(0.0);

  for(float i = 0.0; i < 3.0; i++) {
    coord *= 1.5;
    // fract로 0 ~ 1 사이값을 가진 후 각각의 coord값의 원점을 중앙으로 옮김.
    coord = fract(coord) - 0.5;

    float d = length(coord) * exp(-length(newUV));
    float newD = length(newUV);
    
    vec3 col = palette(newD + i * .4 * uTime * 0.4);
    // sin값에 곱셈을 해줘서 주기가 짧아지고, sin의 곱셈값 만큼 나눗셈을 통해 진폭을 짧게해서 -1 ~ 1 사이값을 -0.5 ~ 0.5로 값을 수정.
    d = sin(d * 8.0 + uTime) / 8.0; 
    d = abs(d);

    // 네온효과 추가, 1.0을 나누면 지금 0 ~ 1 사이인데, 모든 채널의 값이 1.0 이상이기 때문에 흰색이 보임,
    // 반대로 낮은 값을 나눠주면 나눠준값 만큼 offset이 생기고 스무스한 네온효과를 볼 수 있음, 나누는 값이 크면 d의 숫자가 커지기 때문에 밝은 부분이 많아지고 네온효과가 강렬해짐.
    d = pow(0.01 / d, 1.2);

    finalColor += col * d;
  }




  gl_FragColor = vec4(finalColor,1.0);
  // gl_FragColor = vec4(col,1.0);
}