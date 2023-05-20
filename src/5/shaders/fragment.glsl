uniform float progress;
uniform float uTime;
uniform vec4 resolution;
uniform vec3 uMouse;
uniform sampler2D uText;

varying vec2 vUv;
varying vec3 vPosition;

#define PI 3.1415926535897932384626433832795

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main(){
  vec2 direction = normalize(vPosition.xy - uMouse.xy);
  float dist = distance(vPosition, uMouse);
  float prox = 1.0 - map(dist,0.,0.2,0.,1.);
  prox = clamp(prox, 0., 1.);

  vec2 inhaledUv = vUv + direction * prox * 0.05; //흡입하는 느낌을 줌.
  vec2 zoomedUv1 = mix(vUv,uMouse.xy + vec2(0.5),prox);
  vec4 textColor = texture2D(uText,zoomedUv1);

  
  gl_FragColor = textColor;
}