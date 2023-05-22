import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import gsap from 'gsap';

import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';

import image1 from './static/img1.jpg';
import image2 from './static/img2.jpg';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const settings = {
  progress: 0,
};

gui.add(settings, 'progress').min(0).max(1).step(0.01);

const destination = { x: 0, y: 0 };

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
let index = 0;
const textureLoad = new THREE.TextureLoader();
const img1 = textureLoad.load(image1);
const img2 = textureLoad.load(image2);

const imgArray = [img1, img2];

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

// Material
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uImage: { value: imgArray[index] },
    uWaveLength: { value: 3 },
    uMouse: { value: new THREE.Vector2() },
    uRatio: { value: 1 },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    progress: { value: settings.progress },
  },
  side: THREE.DoubleSide,
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

// PlaneGeometry 화면비율에 맞게 꽉차게 하는 함수
function resize() {
  const dist = camera.position.z - mesh.position.z;
  const height = 1;
  camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

  if (sizes.width / sizes.height > 1) {
    mesh.scale.x = 1.05 * (sizes.width / sizes.height);
    mesh.scale.y = 1.05 * (sizes.width / sizes.height);
  }

  camera.updateProjectionMatrix();
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  resize();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 1);
});

/**
 * Camera
 */
// Base camera

const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.01, 1000);
camera.position.set(0, 0, 1);
resize();
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

// uv 좌표 찾는거
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX - sizes.width / 2) / (sizes.width / 2);
  const y = (e.clientY - sizes.height / 2) / (sizes.height / 2);

  destination.x = x;
  destination.y = y;
});

document.body.addEventListener('click', () => {
  const tl = gsap.timeline();

  index = index === 0 ? 1 : 0;

  tl.to(material.uniforms.uWaveLength, { value: 23, duration: 0.5 })
    .to(
      material.uniforms.uRatio,
      {
        value: 0,
        duration: 0.5,
        onComplete: function () {
          material.uniforms.uImage.value = imgArray[index];
        },
      },
      0,
    )
    .to(material.uniforms.uRatio, { value: 1, duration: 0.5 })
    .to(material.uniforms.uWaveLength, { value: 3, duration: 0.5 }, 0.5);
});

let time = 0;

const tick = () => {
  time += 0.05;

  material.uniforms.uTime.value = time;
  material.uniforms.progress.value = settings.progress;

  material.uniforms.uMouse.value.x += (destination.x - material.uniforms.uMouse.value.x) * 0.01;
  material.uniforms.uMouse.value.y += (destination.y - material.uniforms.uMouse.value.y) * 0.01;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
