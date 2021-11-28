import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { buildRoom, hangPainting } from "./room.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);
scene.fog = new THREE.Fog(0x111111, 8, 30);
const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 1.7, 12);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

buildRoom(scene);
const paintings = Array.from({ length: 8 }, (_, i) => `/art/${i + 1}.jpg`);
const frames = [];
paintings.forEach((url, i) => {
  const left = i % 2 === 0;
  frames.push(hangPainting(scene, url, {
    x: left ? -9.9 : 9.9,
    z: -12 + Math.floor(i / 2) * 7,
    rotY: left ? Math.PI / 2 : -Math.PI / 2,
    title: `Untitled #${i + 1}`,
  }));
});

const controls = new PointerLockControls(camera, document.body);
const overlay = document.getElementById("overlay");
overlay.addEventListener("click", () => controls.lock());
controls.addEventListener("lock", () => (overlay.style.display = "none"));
controls.addEventListener("unlock", () => (overlay.style.display = "flex"));

const keys = {};
addEventListener("keydown", (e) => (keys[e.code] = true));
addEventListener("keyup", (e) => (keys[e.code] = false));

const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const CENTER = new THREE.Vector2(0, 0);
const label = document.getElementById("label");
const BOUNDS = { x: 9.3, z: 14.3 };

renderer.setAnimationLoop(() => {
  const dt = clock.getDelta();
  if (controls.isLocked) {
    const speed = (keys.ShiftLeft ? 6 : 3) * dt;
    if (keys.KeyW) controls.moveForward(speed);
    if (keys.KeyS) controls.moveForward(-speed);
    if (keys.KeyA) controls.moveRight(-speed);
    if (keys.KeyD) controls.moveRight(speed);
    const p = camera.position;
    p.x = THREE.MathUtils.clamp(p.x, -BOUNDS.x, BOUNDS.x);
    p.z = THREE.MathUtils.clamp(p.z, -BOUNDS.z, BOUNDS.z);
  }
  raycaster.setFromCamera(CENTER, camera);
  const hit = raycaster.intersectObjects(frames, true)[0];
  const frame = hit && (hit.object.userData.title ? hit.object : hit.object.parent);
  label.textContent = hit && hit.distance < 6 ? frame.userData.title : "";
  renderer.render(scene, camera);
});

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
