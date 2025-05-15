import * as THREE from "three";
import * as CANNON from "cannon-es";
export const dicePhysicsMaterial = new CANNON.Material('diceMaterial');


export function d6Physics() {
  const d6Dimensions = new CANNON.Vec3(0.5, 0.5, 0.5);
  const d6Shape = new CANNON.Box(d6Dimensions);
  const d6Body = new CANNON.Body({
    mass: .00005,
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

export function createD6() {
  const d6Geometry = new THREE.BoxGeometry(1, 1, 1);
  const d6Material = new THREE.MeshStandardMaterial({ color: 0x005500 });
  return new THREE.Mesh(d6Geometry, d6Material);
}
