uniform sampler2D uVideo;
uniform sampler2D uImage;
uniform float uCircleScale;
uniform float uTime;
uniform vec2 uViewPort;

varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

//#define INVERT
mat2 rot2d(in float angle){
  return mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
}
float r(in float a, in float b){
  float d = dot(vec2(a,b),vec2(12.9898,78.233));
  return fract(sin(d) * 43758.5453);
}
float h(in float a){
  float d = dot(a, dot(12.9898,78.233));
  return fract(sin(d) * 43758.5453);
}


float noise(in vec3 x){
    vec3 p  = floor(x);
    vec3 f  = fract(x);
    f       = f*f*(3.0-2.0*f);
    f = f * f * f * (f * (f * 6. - 15.) + 10.);
    float n = p.x + p.y*57.0 + 113.0*p.z;
    return mix(mix(mix( h(n+0.0), h(n+1.0),f.x),
                   mix( h(n+57.0), h(n+58.0),f.x),f.y),
               mix(mix( h(n+113.0), h(n+114.0),f.x),
                   mix( h(n+170.0), h(n+171.0),f.x),f.y),f.z);
}

// https://iquilezles.org/articles/morenoise
// http://www.pouet.net/topic.php?post=401468
vec3 dnoise2f(in vec2 p){
    float i = floor(p.x), j = floor(p.y);
    float u = p.x-i, v = p.y-j;
    float du = 30.*u*u*(u*(u-2.)+1.);
    float dv = 30.*v*v*(v*(v-2.)+1.);
    u=u*u*u*(u*(u*6.-15.)+10.);
    v=v*v*v*(v*(v*6.-15.)+10.);
    float a = r(i,     j    );
    float b = r(i+1.0, j    );
    float c = r(i,     j+1.0);
    float d = r(i+1.0, j+1.0);
    float k0 = a;
    float k1 = b-a;
    float k2 = c-a;
    float k3 = a-b-c+d;
    return vec3(k0 + k1*u + k2*v + k3*u*v,
                du*(k1 + k3*v),
                dv*(k2 + k3*u));
}

float fbm(in vec2 uv){               
  vec2 p = uv;
	float f, dx, dz, w = 0.5;
    f = dx = dz = 0.0;
    for(int i = 0; i < 3; ++i){        
        vec3 n = dnoise2f(uv);
        dx += n.y;
        dz += n.z;
        f += w * n.x / (1.0 + dx*dx + dz*dz);
        w *= 0.86;
        uv *= vec2(1.36);
        uv *= rot2d(1.25*noise(vec3(p*0.1, 0.12*uTime))+
                    0.75*noise(vec3(p*0.1, 0.20*uTime)));
        // 반복 할 때 마다 주기성을 갖지 못하게 할려고, 진폭의 크기와 회전을 줘서 다른 노이즈를 가지게 함.
    }
    return f;
}

// 기본적인 움직이지 않는 fbm
float fbmLow(in vec2 uv){
    float f, dx, dz, w = 0.5;
    f = dx = dz = 0.0;
    for(int i = 0; i < 3; ++i){        
        vec3 n = dnoise2f(uv);
        dx += n.y;
        dz += n.z;
        f += w * n.x / (1.0 + dx*dx + dz*dz);
        w *= 0.95;
        uv *= vec2(3.);
    }
    return f;
}

float circle (vec2 uv, float radius, float sharp) {
  vec2 tempUv = uv - vec2(0.5);
  
  return 1.0 - smoothstep(
    radius - radius * sharp,
    radius + radius * sharp,
    dot(tempUv,tempUv) * 4.0
  );
}


void main(){
  float videoAspect = 1920. / 1080.;
  float screenAspect = uViewPort.x/uViewPort.y;
  vec2 mulitplier = vec2(1.0);
  vec2 centerVector = vUv - vec2(0.5); // 원점을 가운데로 옮기고, - 0.5 ~ 0.5 사이값을 가지게 됨.

  if(videoAspect > screenAspect) {
    mulitplier = vec2(screenAspect / videoAspect,1.0); // 비디오의 크기가 해상도가 스크린의 해상도보다 크면 곱해주는 값을 주려줌.
  }

  vec2 newUv = centerVector * mulitplier + vec2(0.5); // 비디오와 스크린 너비 맞춘 후, 0.5를 추가해 좌하단으로 원점 옮김.

  vec2 noiseUv = centerVector;
  noiseUv *= rot2d(uTime * 10.5); // 시계 방향으로 파동 회전시켜줌.
  // 가운데에서부터 원형으로 퍼지는 기준점? 자세한 내용은 https://greentec.github.io/ 블로그에 빛반사? 관련 포스터에 자세한 설명이 있음.
  // length 함수를 통해 원형의 형태로 원점에서부터 0 > 1 값으로 커짐, length에 값을 곱해주면, 1보다 큰 값이 넓어짐. 거기에 현 좌표값을 나눠서 색상이 반대가 되게끔 작업.
  //  rv는 파동이 점차 커지는? 값
  vec2 rv = noiseUv / (length(noiseUv * 20.) * noiseUv * 20.); 
  float swirl = 10. * fbm(
    noiseUv * fbmLow(vec2(length(noiseUv) - uTime + rv))
  ); // 점차 퍼지는 효과 (Ripple 효과), 맨 앞의 곱셈값으 통해 파동 진폭? 시작값 설정.
  noiseUv *= rot2d(-uTime * 4.5); // 회전 속도 감소.
  // noiseUv의 회전값을 fbmLow에 추가해 구름의 형태로 회전하게 하구, swirl을 추가해 파동을 추가함.
  // 마지막 centerVector은 색상 값 추가하고, 곱셈값은 시작 색상의 밝기.
  vec2 swirlDistort = fbmLow(noiseUv * swirl) * centerVector * 20.;

  vec2 circleUv = centerVector * vec2(1.0) + vec2(0.5); // 0에서 1 사이로 크기 제한.
  // sharp 값은 원의 윤곽선의 선명도, 값이 작으면 윤곽선이 뚜렷하고 값이 크면 윤곽선이 흐릿해짐. 0.25 값을 더해줘서 기본적으로 윤곽선이 흐릿하고, 값을 곱해줘서 흐릿해지는 최대값을 줄여줌.
  float circleProgress = circle(circleUv,uCircleScale ,0.25 + 0.25 * uCircleScale); 

  // 새로운 해상도의 좌표값에 파동을 추가하고, 원의 크기 만큼 값을 빼서 원을 표시.
  // 원의 크기값을 좌표에서 빼서, circleProgress 값에 따른 원의 크기가 결정 되고, circleProgress 값이 커지면 가운데에서부터 점차 0에 가까운 값이 나옴.
  vec2 backgroundUv = 
  newUv + 
  0.3 * swirlDistort - // 파동이 크기를 감소.
  centerVector * circleProgress - // 가운데 원 표현
  0.5 * centerVector * uCircleScale; // 원에서 점차 scale 값의 크기에 따라 centerVector 값을 가짐.

  vec4 image = texture2D(uImage,backgroundUv);
  vec4 video = texture2D(uVideo,newUv);

  // circleProgress 값이 커지면 원점이 가운데에서부터 시작하고, image의 0에 가까운 값이 circleProgress 기준으로 커지기 때문에 그 부분에 mix의 2번째 인자인 video값이 보이게됨.
  vec4 final = mix(image,video,circleProgress);

  // gl_FragColor = vec4(vec3(distance),1.0);
  
  gl_FragColor = vec4(swirl,0.,0.,1.);
  // gl_FragColor = vec4(rv,0.,1.);
  // gl_FragColor = vec4(swirlDistort,0.,1.);
  gl_FragColor = vec4(backgroundUv,0.,1.);
  gl_FragColor = final;
  // gl_FragColor = vec4(vec3(circleProgress),1.0);
  // gl_FragColor = vec4(fbm(vUv  * 100.),0.,0.,1.0);
}