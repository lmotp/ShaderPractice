import * as THREE from 'three';
import * as dat from 'lil-gui';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';

import desert from './static/desert.jpg';

/**
 * Base
 */
const mouse = {
  x: 0,
  y: 0,
  prevX: 0,
  prevY: 0,
  vX: 0,
  vY: 0,
};

// Debug
const gui = new dat.GUI();
const settings = {
  progress: 0,
};

gui.add(settings, 'progress').min(0).max(1).step(0.01);

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoad = new THREE.TextureLoader();
const loadDesert = textureLoad.load(desert);

/**
 * Test mesh
 */
// create a buffer with color data

const textureSize = 128;

const width = textureSize;
const height = textureSize;

const size = width * height;
const data = new Float32Array(4 * size);

for (let i = 0; i < size; i++) {
  const random = Math.random() * 255;
  const stride = i * 4;

  data[stride] = random;
  data[stride + 1] = random;
  data[stride + 2] = random;
  data[stride + 4] = 255;
}

// used the buffer to create a DataTexture
const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat, THREE.FloatType);
texture.magFilter = THREE.NearestFilter;
texture.minFilter = THREE.NearestFilter;

// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

// Material
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uImage: { value: loadDesert },
    uDataTexture: { value: texture },
    resolution: { value: new THREE.Vector4() },
  },
  vertexShader,
  fragmentShader,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const imageAspect = 1 / 1.5;
let a1;
let a2;

if (sizes.height / sizes.width > imageAspect) {
  a1 = (sizes.width / sizes.height) * imageAspect;
  a2 = 1;
} else {
  a1 = 2;
  a2 = (sizes.width / sizes.height) * imageAspect;
}

material.uniforms.resolution.value.x = sizes.width;
material.uniforms.resolution.value.y = sizes.height;
material.uniforms.resolution.value.z = a1;
material.uniforms.resolution.value.w = a2;

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 1);
});

/**
 * Camera
 */
// Base camera
let camera;
camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.01, 1000);

const frustumSize = 1;
camera = new THREE.OrthographicCamera(
  frustumSize / -2,
  frustumSize / 2,
  frustumSize / 2,
  frustumSize / -2,
  -1000,
  1000,
);
camera.position.set(0, 0, 2);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

window.addEventListener('mousemove', (e) => {
  //마우스 좌표에 전체크기를 나눠서 0 ~ 1 사이로 정규화하여 GLSL에 대입
  mouse.x = e.clientX / sizes.width;
  mouse.y = e.clientY / sizes.height;

  mouse.vX = mouse.x - mouse.prevX;
  mouse.vY = mouse.y - mouse.prevY;

  mouse.prevX = mouse.x;
  mouse.prevY = mouse.y;
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 1);

function updateDataTexture() {
  const textureData = texture.image.data;

  for (let i = 0; i < textureData.length; i += 4) {
    textureData[i] *= 0.9;
    textureData[i + 1] *= 0.9;
  }

  let maxDist = 10;
  let gridMouseX = textureSize * mouse.x;
  let gridMouseY = textureSize * (1 - mouse.y);

  for (let i = 0; i < textureSize; i++) {
    for (let j = 0; j < textureSize; j++) {
      let distance = (gridMouseX - i) ** 2 + (gridMouseY - j) ** 2;
      let maxDistSq = maxDist ** 2;

      if (distance < maxDistSq) {
        let index = 4 * (i + textureSize * j);
        let power = maxDist / Math.sqrt(distance);

        if (distance === 0) {
          power = 1;
        }

        textureData[index] += 100 * mouse.vX * power;
        textureData[index + 1] -= 100 * mouse.vY * power;
      }
    }
  }

  mouse.vX *= 0.99;
  mouse.vY *= 0.9;

  texture.needsUpdate = true;
}

/**
 * Animate
 */

let time = 0;

const tick = () => {
  time += 0.05;

  material.uniforms.uTime.value = time;

  controls.update();

  updateDataTexture();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
