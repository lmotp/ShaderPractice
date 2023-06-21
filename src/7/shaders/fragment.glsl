uniform float uTime;
uniform vec2 resolution;

varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

float bar(vec2 loc, vec2 size, vec2 coord) {
  vec2 sw = loc - size / 2. ;
  vec2 ne = loc + size / 2.;

  vec2 ret = step(sw,coord) - step(ne,coord);
  return ret.x * ret.y;
}

float crossBar(vec2 loc, vec2 size, vec2 coord) {
  float b1 = bar(loc,size,coord);
  float b2 = bar(loc,size.yx,coord);

  return max(b1,b2);
}

void main(){
  float rad = 0.4;
  vec2 circleRotate = vec2(sin(uTime * 0.2),cos(uTime * 0.2)) * vec2(rad);

  vec2 coord = vUv;
  // 기준점을 가운대로 옮기면서, 기준점에서 1.0씩 떨어지게끔 수정.
  coord = coord * 2. - 1.;

  //기준점이 움직임.
  coord += circleRotate;

  // 물체가 움직임. 
  // vec2 loc = vec2(0.0) + circleRotate; 
  vec3 col = vec3(crossBar(vec2(0.), vec2(0.1,0.030),coord));
  gl_FragColor = vec4(col,1.0);
}