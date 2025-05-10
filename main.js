import * as THREE from "three";
import * as CANNON from 'cannon-es'

// Handle physics here

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0),
})

//cannon-es uses half size dimensions for my cube(1,1,1) i need .5
const boxDimensions = new CANNON.Vec3(.5, .5, .5);
const boxShape = new CANNON.Box(boxDimensions);
const cubePhysicsMaterial = new CANNON.Material('cube');
const cubeBody = new CANNON.Body({
    mass: 5,
    shape: boxShape,
});
cubeBody.material = cubePhysicsMaterial;
cubeBody.position.set(0, 6, 0);
cubeBody.velocity.set((Math.random() - 0.5) * 10, 10, (Math.random() - 0.5) * 10);
//cubeBody.angularVelocity.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
world.addBody(cubeBody);
//ground
const groundBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane(),
});
//add ground material for the physics object
const groundPhysicsMaterial = new CANNON.Material('ground');
groundBody.material = groundPhysicsMaterial;
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);




//handle contact
const contactMaterial = new CANNON.ContactMaterial(
    cubePhysicsMaterial, groundPhysicsMaterial, {
        friction: 0.3,
        restitution: 0.7
    }
)
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
camera.position.set(0, 5, 20);
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

// cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x005500 })
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

//ground
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x555555})
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

//window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})

//animate
function animate() {
    requestAnimationFrame(animate);
    world.fixedStep();

    cube.position.copy(cubeBody.position);
    cube.quaternion.copy(cubeBody.quaternion);
    renderer.render(scene, camera);
}
animate();
// Find the reset button and add an event listener
const resetButton = document.getElementById('resetButton');

resetButton.addEventListener('click', () => {
    // Reset the cube position
    cube.position.set(0, 2, 0);
    cubeBody.position.set(0, 10, 0); // Same position as cube

    // Reset the cube rotation (optional)
    cube.rotation.set(0, 0, 0);
    cubeBody.rotation.set(0, 0, 0);

    // You might also want to reset velocities if necessary
    cubeBody.velocity.set(0, 0, 0);
    cubeBody.angularVelocity.set(0, 0, 0);
});