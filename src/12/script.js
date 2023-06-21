import * as THREE from 'three';
import * as dat from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';

import dancer from './static/model.glb';

import { extendMaterial } from './extend.js';

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

/**
 * Lights
 */
const lights1 = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(lights1);

const light = new THREE.SpotLight(0xffffff, 0.1, 0, Math.PI / 5, 0.3);
light.position.set(0, 2, 2);
light.target.position.set(0, 0, 0);

light.castShadow = true;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 9;
light.shadow.bias = 0.0001;

light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;

scene.add(light);

/**
 * Test mesh
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(15, 15, 100, 100),
  new THREE.MeshStandardMaterial({ color: 0xcccccc }),
);

floor.rotation.x = -Math.PI * 0.5;
floor.position.y = -1.1;

scene.add(floor);
floor.castShadow = false;
floor.receiveShadow = true;

// Geometry
let geometry;
geometry = new THREE.IcosahedronGeometry(1, 3);
geometry = new THREE.SphereGeometry(1, 32, 32).toNonIndexed();

const len = geometry.attributes.position.count;
const randoms = new Float32Array(len * 3);

for (let i = 0; i < len; i += 3) {
  let r = Math.random();
  randoms[i] = r;
  randoms[i + 1] = r;
  randoms[i + 2] = r;
}

geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

// Material
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  },
  vertexShader,
  fragmentShader,
  wireframe: true,
});

const material2 = new THREE.MeshStandardMaterial({
  color: 0xff0000,
});

const myMaterial = extendMaterial(THREE.MeshStandardMaterial, {
  // Will be prepended to vertex and fragment code
  header: '',

  // Will be prepended to vertex code
  headerVertex: 'attribute float aRandom;',

  // Will be prepended to fragment code
  headerFragment: '',

  // If desired, the material class to create can be defined such as RawShaderMaterial or ShaderMaterial, by
  // default in order to seamlessly work with in-built features the CustomMaterial class provided by this
  // plugin is used which is a slightly extended ShaderMaterial.
  // class: THREE.ShaderMaterial,

  // Insert code lines by hinting at a existing
  vertex: {
    // Inserts the line after #include <fog_vertex>

    '#include <fog_vertex>': 'vEye = normalize(cameraPosition - w.xyz);',

    // Replaces a line (@ prefix) inside of the project_vertex include

    project_vertex: {
      '@vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );':
        'vec4 mvPosition = modelViewMatrix * vec4( transformed * 0.5, 1.0 );',
    },
  },
  fragment: {
    '#include <envmap_fragment>': 'diffuseColor.rgb += pow(dot(vNormal, vEye), 3.0);',
  },

  // Properties to apply to the new THREE.ShaderMaterial
  material: {
    skinning: true,
  },

  // Uniforms (will be applied to existing or added) as value or uniform object
  uniforms: {
    // Use a value directly, uniform object will be created for or ..
    diffuse: new THREE.Color(0xffffff),

    // ... provide the uniform object, by declaring a shared: true property and such you can ensure
    // the object will be shared across materials rather than cloned.
    emissive: {
      shared: true, // This uniform can be shared across all materials it gets assigned to, sharing the value
      mixed: true, // When creating a material with/from a template this will be passed through
      linked: true, // To share them when used as template but not when extending them further, this ensures you don’t have
      // to sync. uniforms from your original material with the depth material for shadows for example (see Demo)
      value: new THREE.Color('pink'),
    },
  },
});

const mesh = new THREE.Mesh(geometry, material2);
mesh.castShadow = true;
mesh.receiveShadow = true;
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
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.001, 1000);
camera.position.set(2, 2, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xffffff, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */

let time = 0;

const tick = () => {
  time += 0.005;

  material.uniforms.uTime.value = time;

  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
