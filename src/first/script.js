import * as THREE from "three";
import * as dat from "lil-gui";
import gsap from "gsap";

import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

import { CurtainShader } from "./shaders/effect1";
import { RGBAShader } from "./shaders/effect2";

import t0 from "./static/t0.jpg";
import t1 from "./static/t1.jpg";
import t2 from "./static/t2.jpg";
import maskUrl from "./static/mask.jpg";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const setting = {
  progress: 0,
  runAnimation: () => {
    runAnimation();
  },
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Geometry
const geometry = new THREE.PlaneGeometry(1920, 1080, 1, 1);

// Material
const texturesArray = [t0, t1, t2];
const textures = texturesArray.map((t) => new THREE.TextureLoader().load(t));
const maskTexture = new THREE.TextureLoader().load(maskUrl);

const groups = [];
textures.forEach((t, j) => {
  const group = new THREE.Group();
  scene.add(group);
  groups.push(group);

  for (let i = 0; i < 3; i++) {
    let textureMaterial = new THREE.MeshBasicMaterial({
      map: t,
    });

    if (i > 0) {
      textureMaterial = new THREE.MeshBasicMaterial({
        map: t,
        alphaMap: maskTexture,
        transparent: true,
      });
    }

    const mesh = new THREE.Mesh(geometry, textureMaterial);
    mesh.position.z = (i + 1) * 100;

    group.add(mesh);
    group.position.x = j * 2500;
  }
});

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
  composer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height, 1, 3000);
camera.position.set(20, 0, 900);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 1);

const mouse = new THREE.Vector2();
const mouseTarget = new THREE.Vector2();

renderer.domElement.addEventListener("mousemove", (event) => {
  const bounds = renderer.domElement.getBoundingClientRect();
  const { clientX, clientY } = event;
  const x = clientX - bounds.left;
  const y = clientY - bounds.top;
  const position = [x, y];

  const uv = [position[0] / bounds.width, position[1] / bounds.height];

  // 0.5를 빼준 이유는 uv의 좌표를 중앙으로 옮기기 위함.
  mouse.x = uv[0] - 0.5;
  mouse.y = uv[1] - 0.5;
});

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const effectPass = new ShaderPass(CurtainShader);
composer.addPass(effectPass);

const effectPass1 = new ShaderPass(RGBAShader);
composer.addPass(effectPass1);

gui.add(setting, "runAnimation");

/**
 * Animate
 */
const runAnimation = () => {
  const tl = gsap.timeline();

  tl.to(camera.position, {
    x: 2500,
    duration: 1.5,
    ease: "power4.inOut",
  });

  tl.to(
    camera.position,
    {
      z: 700,
      duration: 1,
      ease: "power4.inOut",
    },
    0
  );

  tl.to(
    camera.position,
    {
      z: 900,
      duration: 1,
      ease: "power4.inOut",
    },
    1
  );

  tl.to(
    effectPass.uniforms.uProgress,
    {
      value: 1,
      duration: 1,
      ease: "power3.inOut",
    },
    0
  );

  tl.to(
    effectPass.uniforms.uProgress,
    {
      value: 0,
      duration: 1,
      ease: "power3.inOut",
    },
    1
  );

  tl.to(
    effectPass1.uniforms.uProgress,
    {
      value: 1,
      duration: 1,
      ease: "power3.inOut",
    },
    0
  );

  tl.to(
    effectPass1.uniforms.uProgress,
    {
      value: 0,
      duration: 1,
      ease: "power3.inOut",
    },
    1
  );
};

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const oscillator = Math.sin(elapsedTime * 0.1) * 0.5 + 0.5;

  mouseTarget.lerp(mouse, 0.1);

  groups.forEach((g) => {
    g.rotation.x = -mouseTarget.y * 0.3;
    g.rotation.y = -mouseTarget.x * 0.3;

    g.children.forEach((m, i) => {
      m.position.z = (i + 1) * 100 - oscillator * 100;
    });
  });

  // Render
  // renderer.render(scene, camera);
  composer.render();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
