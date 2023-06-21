import * as THREE from "three";
import * as dat from "lil-gui";

import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const settings = {
  progress: 0,
};

gui.add(settings, "progress").min(0).max(1).step(0.01);

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoad = new THREE.TextureLoader();

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

// Material
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    progress: { value: 0 },
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

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera

const frustumSize = 1;
const camera = new THREE.OrthographicCamera(
  frustumSize / -2,
  frustumSize / 2,
  frustumSize / 2,
  frustumSize / -2,
  -1000,
  1000
);
camera.position.set(0, 0, 1);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xeeeeee, 1);

/**
 * Animate
 */

let time = 0;

const tick = () => {
  time += 0.05;

  material.uniforms.uTime.value = time;
  material.uniforms.progress.value = settings.progress;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
