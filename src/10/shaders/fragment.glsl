varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

void main(){
  vec2 coord = vUv;
  coord = coord * 2. -1.;

  float dis = smoothstep(0.5, 0.51, length(coord));
  vec3 color = vec3(dis);

  gl_FragColor = vec4(color, 1.0);

}