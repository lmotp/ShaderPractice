import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';

import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';

import texture from './static/test.png';

class Point {
  constructor(x, y) {
    this.position = new THREE.Vector2(x, y);
    this.originalPos = new THREE.Vector2(x, y);

    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    );
  }

  update(mouse) {
    let mouseForce = this.originalPos.clone().sub(mouse);
    let distance = mouseForce.length();
    let forceFactor = 1 / Math.max(distance, 0.2);
    let positionToGo = this.originalPos
      .clone()
      .sub(mouseForce.normalize().multiplyScalar(-distance * 0.2 * forceFactor));
    this.position.lerp(positionToGo, 0.1);

    this.mesh.position.x = this.position.x;
    this.mesh.position.y = this.position.y;
  }
}

/**
 * Base
 */
const rayCaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const points = [];

// Debug
const gui = new dat.GUI();
const settings = {
  progress: 0,
};

gui
  .add(settings, 'progress')
  .min(-1)
  .max(1)
  .step(0.01)
  .onChange(() => {
    material.uniforms.progrss.value = settings.progress;

    mesh.position.x = settings.progress * screenSpaceWidth;
  });

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoad = new THREE.TextureLoader();
const uTexture = textureLoad.load(texture);

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
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(0, 0, 1.7);
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
renderer.setClearColor(0x444444, 1);

for (let i = 0; i < 4; i++) {
  let x = Math.random() * 2 - 1;
  let y = Math.random() * 2 - 1;
  let p = new Point(x, y);

  points.push(p);
  scene.add(p.mesh);
}

function updateGo(time) {
  let posArray = geometry.attributes.position.array;

  for (let i = 0; i < posArray.length; i += 3) {
    let x = posArray[i];
    let y = posArray[i + 1];
    let z = posArray[i + 2];

    let noise = 0.1 * Math.sin(y + time * 2) * 0.2;
    // posArray[i] = x + noise;
  }

  geometry.attributes.position.needsUpdate = true;
}

const testMesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
const debugMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 10, 10),
  new THREE.MeshBasicMaterial({ color: 0xff0000 }),
);
scene.add(debugMesh);

window.addEventListener(
  'mousemove',
  (e) => {
    mouse.x = (e.clientX / sizes.width) * 2 - 1;
    mouse.y = -(e.clientY / sizes.height) * 2 + 1;

    rayCaster.setFromCamera(mouse, camera);

    const intersects = rayCaster.intersectObjects([testMesh]);

    if (intersects.length > 0) {
      mouse.x = intersects[0].point.x;
      mouse.y = intersects[0].point.y;
      debugMesh.position.copy(intersects[0].point);
    }
  },
  false,
);

/**
 * Animate
 */

let time = 0;
let screenSpaceWidth = Math.tan((camera.fov * Math.PI) / 180 / 2) * camera.position.z * camera.aspect;

/**
 * Test mesh
 */
// Geometry
let geometry;

// Material
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: uTexture },
    progress: { value: 0 },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  },
  vertexShader,
  fragmentShader,
  // wireframe: true,
});

for (let i = -2; i < 3; i++) {
  geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
  let m = material.clone();
  m.uniforms.uTexture.value = uTexture;
  m.uniforms.progress.value = i / 2;

  let p = new THREE.Mesh(geometry, m);
  p.position.x = i;
  scene.add(p);
}

const tick = () => {
  time += 0.05;

  material.uniforms.uTime.value = time;
  material.uniforms.progress.value = settings.progress;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  updateGo(time);

  points.forEach((p) => p.update(mouse));

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
