uniform float uTime;
uniform vec2 resolution;
uniform float progress;

varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

// vec2 hash_p( vec2 p ) {
//   float st1 = dot(p,vec2(127.1,311.7));
//   float st2 = dot(p,vec2(269.5,183.3));
//   vec2 result = vec2(st1,st2);

// 	// return -1.0 + 2.0*fract(sin(p) * 43758.5453123);
// 	return fract(sin(result) * 43758.5453123);
// }

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

vec2 hash_p( vec2 x ) {
    const vec2 k = vec2( 0.3183099, 0.3678794 );
    x = x*k + k.yx;
    return -1.0 + 2.0*fract( 16.0 * k*fract( x.x*x.y*(x.x+x.y)) ); // -1 ~ 1 사이
}

float noise_p( in vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );

    vec2 u = f * f * f * (f * (f * 6. - 15.) + 10.);

    return mix( mix( dot( hash_p( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( hash_p( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( hash_p( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( hash_p( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

float fbm(vec2 uv) {
    float fbmNoise = 0.0;
    float amplitude = 1.0; //진폭
    const float octaves = 3.0; // 이 값이 클 수록 자연에 가까운 자잘한 노이즈가 많이 생김.
    
    for(float i = 0.0; i < octaves; i++) {
        fbmNoise = noise_p(uv) * amplitude + fbmNoise;
        amplitude *= 0.5;
        uv *= 2.; // 진폭을 늘려서 확대를 통해 반복 할 수록 노이즈가 크기가 더 작아진다.
    }
    
    return fbmNoise;
}

vec3 palette(float f) {
  vec3 a = vec3(0.5,0.5,0.5);
  vec3 b = vec3(0.5,0.5,0.5);
  vec3 c = vec3(1.0,1.0,1.0);
  vec3 d = vec3(0.263,0.416,0.557);

  return a + b * cos(6.28318 * (c * f + d));
}

void main() {
  vec2 coord = vUv - 0.5;
  vec2 newCoord = coord * 10.;
  vec2 circleCoord = coord * 2.0;

  float center = length(newCoord);
  
  float d = length(circleCoord);
  vec3 color = palette(length(coord));

  d = sin(d * 10.) / 10.;
  d = abs(d);
  
  d =  (progress - 0.1) * 0.5 / d;

  vec3 circle = vec3(d) * color;

  newCoord = newCoord * rotate2d(uTime * min(progress,0.45) / center);  
  vec3 fbmNoise = vec3(fbm(newCoord )) * 0.5 + 0.5;
  fbmNoise *= circle + 0.3;

  gl_FragColor = vec4(circle,1.0);
  gl_FragColor = vec4(fbmNoise,1.0);
  // gl_FragColor = vec4(vec3(center),1.0);
  // gl_FragColor = vec4(vec3(coord,1.0),1.0);
  
}