uniform float progress;
uniform float uTime;
uniform vec4 resolution;
uniform sampler2D uImage;
uniform sampler2D displacement;

varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

void main(){
  vec4 displace = texture2D(displacement, vUv.yx);
  vec2 displacedUv = vec2(
    vUv.x,
    vUv.y
  );

  displacedUv.y = mix(vUv.y,displace.r - 0.1 ,progress);

  vec4 image = texture2D(uImage, displacedUv);
  image.r = texture2D(uImage,displacedUv + vec2(0.0,0.005) * progress).r;
  image.g = texture2D(uImage,displacedUv + vec2(0.0,0.01) * progress).g;
  image.b = texture2D(uImage,displacedUv + vec2(0.0,0.02) * progress).b;




  gl_FragColor = image;
}