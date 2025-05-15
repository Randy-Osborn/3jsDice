import * as THREE from "three";
import * as CANNON from "cannon-es";
import { createD6, d6Physics, dicePhysicsMaterial } from "./dice.js";
import { createDiceBox, createDiceBoxBounds ,boxPhysicsMaterial } from "./diceBox.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

//physics

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0),
});
const d6Body = d6Physics();
world.addBody(d6Body);

const diceBoxBody = createDiceBoxBounds();
world.addBody(diceBoxBody);

const contactMaterial = new CANNON.ContactMaterial(
  dicePhysicsMaterial,
  boxPhysicsMaterial,
  {
    friction: .005,
    restitution: 1,
  }
);
world.addContactMaterial(contactMaterial);


//scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);
//camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0.13, 12.54, 19.1);
camera.lookAt(0, 0, 0);

//renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

//camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0); // focus the controls on the center of the box
controls.update();

const d6 = createD6();
scene.add(d6);

const ground = createDiceBox();
scene.add(ground);

//window Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//animate
function animate() {
  requestAnimationFrame(animate);
  world.fixedStep();
  controls.update();
  d6.position.copy(d6Body.position);
  d6.quaternion.copy(d6Body.quaternion);
  renderer.render(scene, camera);
}
animate();
const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", () => {
  d6.position.set(0, 8, 0);
  d6Body.position.set(0, 8, 0);
  d6Body.velocity.set(
    (Math.random() - 0.5) * 15,
    0,
    (Math.random() - 0.5) * 15
  );
  d6Body.angularVelocity.set(
    (Math.random() - 0.5) * 15,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 15
  );
});
