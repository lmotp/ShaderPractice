import * as THREE from 'three';
import * as dat from 'lil-gui';

import bg from './static/bg.jpg';
import base from './static/base.png';
import flower from './static/flower.png';

/**
 * Base
 */

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
const loadBg = textureLoad.load(bg);
const loadBase = textureLoad.load(base);
const loadFlower = textureLoad.load(flower);

/**
 * Test mesh
 */

// Geometry
const geometry = new THREE.SphereGeometry(300, 200, 200);

// Material
const material = new THREE.MeshBasicMaterial({ map: loadFlower, map: loadBase, overdraw: true });

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

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
  renderer.setClearColor(0xffffff, 1);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.OrthographicCamera(
  window.innerWidth / -2,
  window.innerWidth / 2,
  window.innerHeight / 2,
  window.innerHeight / -2,
  1,
  1000,
);

camera.position.set(0, 0, 1000);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#B40B12', 1);

/**
 * Animate
 */

let time = 0;

const tick = () => {
  time += 0.05;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
