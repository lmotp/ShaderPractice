import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";

import imageUrl from "./static/desert.jpg";

import gsap from "gsap";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const settings = {
  scale: 0,
};

gui.add(settings, "scale").min(0).max(2).step(0.01);

document.body.addEventListener("mousedown", () => {
  gsap.to(settings, {
    duration: 0.5,
    scale: 2,
  });
});

document.body.addEventListener("mouseup", () => {
  gsap.to(settings, {
    duration: 0.5,
    scale: 0,
  });
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const videoDom = document.querySelector("#video-bg");
const video = new THREE.VideoTexture(videoDom);
const image = new THREE.TextureLoader().load(imageUrl);

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

// Material
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uCircleScale: { value: 0 },
    uImage: { value: image },
    uViewPort: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uVideo: { value: video },
  },
  vertexShader,
  fragmentShader,
});
// Mesh
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
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
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

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xffffff, 1);

/**
 * Animate
 */
const clock = new THREE.Clock();

let time = 0;

const tick = () => {
  time += 0.01;

  material.uniforms.uTime.value = time;
  material.uniforms.uCircleScale.value = settings.scale;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
