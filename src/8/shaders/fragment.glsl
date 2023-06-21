uniform float uTime;
uniform vec2 resolution;

varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

float circle(vec2 st, vec2 loc, float size) {
  float ret = size / distance(st,loc);
  return ret;
}

void main(){
  vec2 coord = vUv;
  coord -= 0.5;
  float r = 0.05;

  float c = circle(coord, vec2(0., 0.),r);
  c += circle(coord, vec2(-0.2, 0.),r);
  c += circle(coord, vec2(0.2, 0.),r);
  c += circle(coord, vec2(sin(uTime * 0.5) * 0.4,cos(uTime * 0.3) * 0.4), sin(uTime * 0.5) * 0.1);
  c += circle(coord, vec2(sin(uTime * 0.7) * 0.5,cos(uTime * 0.5) * 0.5), r);

  gl_FragColor = vec4(c,c * c / 3.,0.0,1.0);
}