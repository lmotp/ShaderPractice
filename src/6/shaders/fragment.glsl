uniform float uTime;
uniform float uRatio;
uniform float progress;
uniform sampler2D uImage;
uniform vec2 resolution;
uniform vec2 uMouse;

varying vec2 vUv;
varying vec3 vPosition;

#define PI 3.1415926535897932384626433832795


void main(){
  vec2 p = 7.68 * (gl_FragCoord.xy / resolution.xy - vec2(0.5,1.0)) - vec2(uMouse.x - 15.);
  vec2 i = p;
  float c = 1.1;

  for(int n = 0; n < 4; n++) {
    float t = uTime * (1.0 - (10. / float(n + 10)));
    float ix = i.x + uMouse.x;
    float iy = i.y + uMouse.y;
    i = vec2(cos(t - ix) + sin(t + iy), sin(t - iy) + cos(t + ix)) + p;
    c += float(n) / length(vec2(p.x / sin(t + ix) / 1.1, p.y / cos(t + i.y) / 1.1)) * 20.;
  }

  c /= 100.;
  c = 1.8 - sqrt(c);


  vec4 color = texture2D(uImage, vUv) * texture2D(uImage,vec2(vUv.x + cos(c)*uMouse.x * 0.5, vUv.y + cos(c) * uMouse.y * 0.5));
  vec4 ct = c * c * c * color;
  gl_FragColor = ct - color * color - vec4(color.rgb,vPosition.z);
  gl_FragColor = color * vec4(uRatio,uRatio,uRatio,1.0);
}