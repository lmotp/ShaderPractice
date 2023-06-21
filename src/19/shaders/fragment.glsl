uniform float progress;
uniform float uTime;
uniform vec2 resolution;
uniform sampler2D uImage;

varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

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
    const float octaves = 4.0; // 이 값이 클 수록 자연에 가까운 자잘한 노이즈가 많이 생김.
    
    for(float i = 0.0; i < octaves; i++) {
        fbmNoise = noise_p(uv) * amplitude + fbmNoise;
        amplitude *= 0.5;
        uv *= 2.; // 진폭을 늘려서 확대를 통해 반복 할 수록 노이즈가 크기가 더 작아진다.
    }
    
    return fbmNoise;
}

void main() {
  vec2 imageUV = vUv;
  vec2 circleUV = vUv;
  vec2 coord = vUv * 10.;

  float r = 30.;


  imageUV = vec2(length(imageUV - 0.5));

  vec3 image = texture2D(uImage,vec2(floor(imageUV.x * r) / r),imageUV.y).xyz;
  
  vec3 circle = vec3(length(circleUV - 0.5));
  circle = smoothstep(0.3,0.35,circle);

  image += circle;


  vec3 color = vec3(fbm(coord)) * 0.5 + 0.5;

  gl_FragColor = vec4(image,1.0);
//   gl_FragColor = vec4(vec3(x),1.0);
}