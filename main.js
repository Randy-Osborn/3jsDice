import * as THREE from "three";
import * as CANNON from "cannon-es";
import { createD6, d6Physics, dicePhysicsMaterial } from "./dice.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Handle physics here

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0),
});

const d6Body = d6Physics();
world.addBody(d6Body);
//ground
const groundBody = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Plane(),
});
//add ground material for the physics object
const groundPhysicsMaterial = new CANNON.Material("ground");
groundBody.material = groundPhysicsMaterial;
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

//walls possibly
const wallSize = 20;
const wallHeight = 15;

const wallPhysicsMaterial = new CANNON.Material("wallPhysics");
const wallThickness = 0.5;
const groundSize = 10; // Half of 20x20 ground

// LEFT physics wall
const physicsWallLeft = new CANNON.Body({
  mass: 0,
  material: wallPhysicsMaterial,
  shape: new CANNON.Box(
    new CANNON.Vec3(wallThickness / 2, wallHeight / 2, groundSize)
  ),
  position: new CANNON.Vec3(-groundSize, wallHeight / 2, 0),
});
world.addBody(physicsWallLeft);

// RIGHT physics wall
const physicsWallRight = new CANNON.Body({
  mass: 0,
  material: wallPhysicsMaterial,
  shape: new CANNON.Box(
    new CANNON.Vec3(wallThickness / 2, wallHeight / 2, groundSize)
  ),
  position: new CANNON.Vec3(groundSize, wallHeight / 2, 0),
});
world.addBody(physicsWallRight);

// BACK physics wall
const physicsWallBack = new CANNON.Body({
  mass: 0,
  material: wallPhysicsMaterial,
  shape: new CANNON.Box(
    new CANNON.Vec3(groundSize, wallHeight / 2, wallThickness / 2)
  ),
  position: new CANNON.Vec3(0, wallHeight / 2, -groundSize),
});
world.addBody(physicsWallBack);

// FRONT physics wall
const physicsWallFront = new CANNON.Body({
  mass: 0,
  material: wallPhysicsMaterial,
  shape: new CANNON.Box(
    new CANNON.Vec3(groundSize, wallHeight / 2, wallThickness / 2)
  ),
  position: new CANNON.Vec3(0, wallHeight / 2, groundSize),
});
world.addBody(physicsWallFront);

//handle contact
const contactMaterial = new CANNON.ContactMaterial(
  dicePhysicsMaterial,
  groundPhysicsMaterial,
  {
    friction: 0.6,
    restitution: 0.6,
  }
);
world.addContactMaterial(contactMaterial);
// Create the basic scene and object rendering
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

//ground
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);
//wall visual
const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  transparent: true,
  opacity: 0.001,
  side: THREE.DoubleSide, // important so it's visible from both sides
});

// Back wall (along -Z)
const backWall = new THREE.Mesh(
  new THREE.PlaneGeometry(wallSize, wallHeight),
  wallMaterial
);
backWall.position.set(0, wallHeight / 2, -wallSize / 2);
backWall.rotation.y = Math.PI;

// Front wall (along +Z)
const frontWall = new THREE.Mesh(
  new THREE.PlaneGeometry(wallSize, wallHeight),
  wallMaterial
);
frontWall.position.set(0, wallHeight / 2, wallSize / 2);
scene.add(frontWall);

// Left wall (along -X)
const leftWall = new THREE.Mesh(
  new THREE.PlaneGeometry(wallSize, wallHeight),
  wallMaterial
);
leftWall.position.set(-wallSize / 2, wallHeight / 2, 0);
leftWall.rotation.y = Math.PI / 2;
scene.add(leftWall);

// Right wall (along +X)
const rightWall = new THREE.Mesh(
  new THREE.PlaneGeometry(wallSize, wallHeight),
  wallMaterial
);
rightWall.position.set(wallSize / 2, wallHeight / 2, 0);
rightWall.rotation.y = -Math.PI / 2;
scene.add(rightWall);

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
// Find the reset button and add an event listener
const resetButton = document.getElementById("resetButton");

resetButton.addEventListener("click", () => {
  // Reset the d6 position
  d6.position.set(0, 8, 0);
  d6Body.position.set(0, 8, 0);

  // You might also want to reset velocities if necessary
  d6Body.velocity.set(
    (Math.random() - 0.5) * 15,
    10,
    (Math.random() - 0.5) * 15
  );
  d6Body.angularVelocity.set(
    (Math.random() - 0.5) * 15,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 15
  );
});
