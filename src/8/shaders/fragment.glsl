uniform float uTime;
uniform vec2 resolution;

varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

<<<<<<< HEAD

float circle(vec2 st, vec2 loc,float size) {
  return size / distance(st,loc);
}

// 안쪽에 있는 곱셈값은 주기(회전속도), 바깥에 있는 곱셈값은 파동(회전반경)
vec2 loc(vec2 cosArg, vec2 sinArg) {
  vec2 ret = vec2(sin(uTime * cosArg.x) * cosArg.y, cos(uTime * sinArg.x) * sinArg.y);
=======
float circle(vec2 st, vec2 loc, float size) {
  float ret = size / distance(st,loc);
>>>>>>> 416bcaaa0d185f2d60741484a020902004b91bfa
  return ret;
}

void main(){
  vec2 coord = vUv;
<<<<<<< HEAD
  coord -= 0.5;  
  float r = 0.035;

  float c = circle(coord,loc(vec2(0.2,0.2), vec2(0.3,0.4)),r);
  c += circle(coord, loc(vec2(0.3,0.4),vec2(0.25,0.15)),r * abs(sin(uTime * 0.5)));
  c += circle(coord, vec2(-0.2, 0.),r);
  c += circle(coord, vec2(0.2, 0.),r);
  

  gl_FragColor = vec4(c, c * c / 4., 0.0 , 1.0);
=======
  coord -= 0.5;
  float r = 0.05;

  float c = circle(coord, vec2(0., 0.),r);
  c += circle(coord, vec2(-0.2, 0.),r);
  c += circle(coord, vec2(0.2, 0.),r);
  c += circle(coord, vec2(sin(uTime * 0.5) * 0.4,cos(uTime * 0.3) * 0.4), sin(uTime * 0.5) * 0.1);
  c += circle(coord, vec2(sin(uTime * 0.7) * 0.5,cos(uTime * 0.5) * 0.5), r);

  gl_FragColor = vec4(c,c * c / 3.,0.0,1.0);
>>>>>>> 416bcaaa0d185f2d60741484a020902004b91bfa
}