uniform float uTime;
uniform vec4 resolution;
uniform sampler2D uImage;
uniform sampler2D uDataTexture;

varying vec2 vUv;

#define PI 3.1415926535897932384626433832795


void main(){
  vec2 newUv = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);
  vec3 color = vec3(newUv,1.0);
  
  vec4 offset = texture2D(uDataTexture,vUv);
  vec4 image = texture2D(uImage,newUv - 0.02 * offset.rg);

  gl_FragColor = vec4(color, 1.0);
  gl_FragColor = image;
  // gl_FragColor = offset;
}