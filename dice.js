import * as THREE from "three";
import * as CANNON from "cannon-es";
export const dicePhysicsMaterial = new CANNON.Material("diceMaterial");

export function d6Physics() {
  const d6Dimensions = new CANNON.Vec3(0.5, 0.5, 0.5);
  const d6Shape = new CANNON.Box(d6Dimensions);
  const d6Body = new CANNON.Body({
    mass: 0.00005,
    shape: d6Shape,
  });
  d6Body.material = dicePhysicsMaterial;
  d6Body.position.set(0, 6, 0);
  d6Body.velocity.set(
    (Math.random() - 0.5) * 25,
    10,
    -(Math.random() - 0.5) * 25
  );
  d6Body.angularVelocity.set(
    (Math.random() - 0.5) * 15,
    (Math.random() - 0.5) * 15,
    (Math.random() - 0.5) * 15
  );
  return d6Body;
}

function createTextTexture(number) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");

  // Background (optional)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);

  // Number
  ctx.fillStyle = "#000000";
  ctx.font = "bold 160px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(number, size / 2, size / 2);

  const texture = new THREE.CanvasTexture(canvas);
  return new THREE.MeshStandardMaterial({ map: texture });
}

export function createD6() {
  const d6Material = [
    createTextTexture("3"),//0
    createTextTexture("4"),//1
    createTextTexture("1"),//2
    createTextTexture("6"),//3
    createTextTexture("2"),//4
    createTextTexture("5"),//5
  ];
  const d6Geometry = new THREE.BoxGeometry(1, 1, 1);
  // const d6Material = new THREE.MeshStandardMaterial({ color: 0x005500 });
  return new THREE.Mesh(d6Geometry, d6Material);
}

export function getTopFaceNumber(mesh) {
  const faceNormals = [
  new THREE.Vector3(1, 0, 0),   // +X → "3"
    new THREE.Vector3(-1, 0, 0),  // -X → "4"
    new THREE.Vector3(0, 1, 0),   // +Y → "1"
    new THREE.Vector3(0, -1, 0),  // -Y → "6"
    new THREE.Vector3(0, 0, 1),   // +Z → "2"
    new THREE.Vector3(0, 0, -1),  // -Z → "5"
  ];
  
  const faceToDieNumber = [3, 4, 1, 6, 2, 5];
  let maxDot = -Infinity;
  let topFaceIndex = -1;
  const worldUp = new THREE.Vector3(0, 1, 0);

  for (let i = 0; i < faceNormals.length; i++) {
    const worldNormal = faceNormals[i].clone().applyQuaternion(mesh.quaternion);
    const dot = worldNormal.dot(worldUp); // compare with world's up vector

    if (dot > maxDot) {
      maxDot = dot;
      topFaceIndex = i;
    }
  }

  return faceToDieNumber[topFaceIndex]; // This is the index of the face most pointing up
}