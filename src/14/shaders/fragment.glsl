uniform sampler2D uTexture;
uniform vec2 resolution;
uniform float progress;

varying vec2 vUv;
varying vec3 vPosition;

#define PI 3.1415926535897932384626433832795

void main(){
  vec2 coord = vUv;
  //마스크 하는 효과랑 유사함. 이미지의 uv값은 고정이기 때문.
  vec2 normalizedUV = gl_FragCoord.xy / resolution.xy;
  float aspect = resolution.x / resolution.y;
  vec2 scale;

  if(aspect > 1.) {
    scale = vec2(1., 1./aspect);
  } else {
    scale = vec2(aspect, 1.);
  }

  normalizedUV = (normalizedUV - vec2(0.5)) * scale * 2.0 + vec2(0.5);
  normalizedUV.x -= progress;
  
  vec4 color = texture2D(uTexture,normalizedUV);

  gl_FragColor = vec4(normalizedUV,0.,1.);
  gl_FragColor = color;
}