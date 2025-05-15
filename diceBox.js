import * as THREE from "three";
import * as CANNON from "cannon-es";
export const boxPhysicsMaterial = new CANNON.Material("boxPhysics");

export function createDiceBox() {
  const baseGeometry = new THREE.PlaneGeometry(20, 20);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    side: THREE.DoubleSide,
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.rotation.x = -Math.PI / 2;

  return base;
}

export function createDiceBoxBounds() {
  const groundSize = 10;
  const wallHeight = 15;
  const wallThickness = .1;
  
  const diceBoxBody = new CANNON.Body({ mass: 0, boxPhysicsMaterial });
  
  const floorShape = new CANNON.Box(new CANNON.Vec3(groundSize, wallThickness / 2, groundSize));
  diceBoxBody.addShape(floorShape, new CANNON.Vec3(0, -wallThickness / 2, 0));

  const leftWallShape = new CANNON.Box(new CANNON.Vec3(wallThickness/2, wallHeight / 2, groundSize));
  diceBoxBody.addShape(leftWallShape, new CANNON.Vec3(-groundSize,wallHeight / 2, 0));


  const rightWallShape = new CANNON.Box(new CANNON.Vec3(wallThickness/2, wallHeight / 2, groundSize));
  diceBoxBody.addShape(rightWallShape, new CANNON.Vec3(groundSize, wallHeight / 2, 0));
  
  const backWallShape = new CANNON.Box(new CANNON.Vec3(groundSize, wallHeight / 2, wallThickness / 2));
  diceBoxBody.addShape(backWallShape, new CANNON.Vec3(0, wallHeight / 2, -groundSize));
  
  const frontWallShape = new CANNON.Box(new CANNON.Vec3(groundSize, wallHeight / 2, wallThickness / 2));
  diceBoxBody.addShape(frontWallShape, new CANNON.Vec3(0, wallHeight / 2, groundSize));
  
  return diceBoxBody;
}
