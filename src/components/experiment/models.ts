import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const ceramic = new THREE.MeshStandardMaterial({
  color: "#ede9dc",
  roughness: 0.55,
});

const graphite = new THREE.MeshStandardMaterial({
  color: "#30342e",
  roughness: 0.48,
});

const brass = new THREE.MeshStandardMaterial({
  color: "#9c7850",
  metalness: 0.74,
  roughness: 0.32,
});

const copper = new THREE.MeshStandardMaterial({
  color: "#ba4d2b",
  roughness: 0.57,
});

function mesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  parent: THREE.Object3D,
  position: [number, number, number]
) {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(...position);
  object.castShadow = true;
  object.receiveShadow = true;
  parent.add(object);
  return object;
}

export function createPlug(index: number = 0) {
  const group = new THREE.Group();
  group.userData.plug = index;

  mesh(
    new RoundedBoxGeometry(0.38, 0.35, 0.53, 3, 0.08),
    graphite,
    group,
    [0, 0, 0]
  );

  const face = mesh(
    new RoundedBoxGeometry(0.31, 0.28, 0.06, 2, 0.04),
    graphite,
    group,
    [0, 0, -0.27]
  );
  face.material = new THREE.MeshStandardMaterial({
    color: "#454940",
    roughness: 0.45,
  });

  for (const x of [-0.09, 0.09]) {
    const pin = mesh(
      new THREE.CylinderGeometry(0.023, 0.023, 0.2, 10),
      brass,
      group,
      [x, 0, -0.38]
    );
    pin.rotation.x = Math.PI / 2;
  }

  for (let n = 0; n < 4; n++) {
    mesh(
      new RoundedBoxGeometry(0.393, 0.015, 0.16, 1, 0.005),
      graphite,
      group,
      [0, 0.13 - n * 0.078, 0.09]
    );
  }

  const sleeve = mesh(
    new THREE.CylinderGeometry(0.055, 0.078, 0.22, 12),
    copper,
    group,
    [0, 0, 0.34]
  );
  sleeve.rotation.x = Math.PI / 2;

  const accent = mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.025, 12),
    brass,
    group,
    [0, 0, 0.25]
  );
  accent.rotation.x = Math.PI / 2;

  // Larger invisible hit sphere for responsive touch & mouse dragging
  const hit = mesh(
    new THREE.SphereGeometry(0.35, 12, 10),
    new THREE.MeshBasicMaterial({ visible: false }),
    group,
    [0, 0, 0]
  );
  hit.userData.plug = index;

  return group;
}

export function createFloorTerminal(position: THREE.Vector3) {
  const group = new THREE.Group();
  group.position.copy(position);

  // Brass circular flange on floor
  mesh(
    new THREE.CylinderGeometry(0.24, 0.26, 0.04, 32),
    brass,
    group,
    [0, -0.05, 0]
  );

  // Dark industrial collar
  mesh(
    new THREE.CylinderGeometry(0.12, 0.16, 0.08, 24),
    graphite,
    group,
    [0, -0.01, 0]
  );

  // Rubber strain relief boot angled upward
  const boot = mesh(
    new THREE.ConeGeometry(0.09, 0.16, 20),
    graphite,
    group,
    [0, 0.05, 0]
  );
  boot.rotation.x = Math.PI;

  return group;
}

export function createWallHinge(position: THREE.Vector3) {
  const group = new THREE.Group();
  group.position.copy(position);

  // Wall mounting bracket flange
  const plate = mesh(
    new THREE.CylinderGeometry(0.26, 0.26, 0.06, 24),
    brass,
    group,
    [0, 0, -0.08]
  );
  plate.rotation.x = Math.PI / 2;

  // Swivel hinge barrel
  const hinge = mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.32, 20),
    graphite,
    group,
    [0, 0, 0.06]
  );
  hinge.rotation.z = Math.PI / 2;

  // Metallic conduit elbow curving the cable out into the room
  const collar = mesh(
    new THREE.CylinderGeometry(0.085, 0.095, 0.18, 16),
    copper,
    group,
    [0.1, -0.06, 0.12]
  );
  collar.rotation.z = Math.PI / 4;

  return group;
}

export function createSocket(position: THREE.Vector3, index: number, accentColor: string = "#bd5a35") {
  const group = new THREE.Group();
  group.position.copy(position);
  group.userData.socket = index;

  mesh(
    new RoundedBoxGeometry(0.92, 1.1, 0.11, 4, 0.09),
    ceramic,
    group,
    [0, 0, -0.33]
  );

  const outer = mesh(
    new THREE.CylinderGeometry(0.33, 0.33, 0.046, 40),
    brass,
    group,
    [0, 0, -0.255]
  );
  outer.rotation.x = Math.PI / 2;

  const recess = mesh(
    new THREE.CylinderGeometry(0.303, 0.303, 0.05, 40),
    ceramic,
    group,
    [0, 0, -0.232]
  );
  recess.rotation.x = Math.PI / 2;

  for (const x of [-0.092, 0.092]) {
    const hole = mesh(
      new THREE.CylinderGeometry(0.038, 0.038, 0.055, 14),
      graphite,
      group,
      [x, 0, -0.2]
    );
    hole.rotation.x = Math.PI / 2;
  }

  for (const y of [-0.43, 0.43]) {
    const screw = mesh(
      new THREE.CylinderGeometry(0.031, 0.031, 0.02, 12),
      brass,
      group,
      [0, y, -0.258]
    );
    screw.rotation.x = Math.PI / 2;
    mesh(new THREE.BoxGeometry(0.032, 0.006, 0.008), graphite, group, [
      0,
      y,
      -0.242,
    ]);
  }

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.41, 0.014, 8, 48),
    new THREE.MeshBasicMaterial({
      color: accentColor,
      transparent: true,
      opacity: 0,
    })
  );
  ring.position.z = -0.16;
  group.add(ring);

  return { group, ring };
}

export function createBulb(
  x: number,
  y: number,
  emissiveColor: string = "#ffab46",
  haloColor: string = "rgba(255,190,85,0.5)"
) {
  const group = new THREE.Group();
  group.position.set(x, y, -1.51);

  const backing = mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.1, 32),
    brass,
    group,
    [0, 0.26, 0]
  );
  backing.rotation.x = Math.PI / 2;

  const arm = mesh(
    new THREE.CylinderGeometry(0.042, 0.042, 0.48, 12),
    brass,
    group,
    [0, 0.26, 0.25]
  );
  arm.rotation.x = Math.PI / 2;

  mesh(
    new THREE.CylinderGeometry(0.11, 0.11, 0.25, 24),
    brass,
    group,
    [0, 0.21, 0.49]
  );

  for (let i = 0; i < 5; i++) {
    mesh(new THREE.TorusGeometry(0.112, 0.01, 6, 24), brass, group, [
      0,
      0.13 + i * 0.035,
      0.49,
    ]).rotation.x = Math.PI / 2;
  }

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: "#e0c5a0",
    roughness: 0.15,
    metalness: 0.05,
    transparent: true,
    opacity: 0.4,
    transmission: 0.35,
    thickness: 0.06,
    emissive: emissiveColor,
    emissiveIntensity: 0,
  });

  const globe = mesh(
    new THREE.SphereGeometry(0.31, 32, 24),
    glassMaterial,
    group,
    [0, -0.17, 0.49]
  );
  globe.scale.y = 1.23;

  const neck = mesh(
    new THREE.CylinderGeometry(0.13, 0.21, 0.2, 24),
    glassMaterial,
    group,
    [0, 0.07, 0.49]
  );
  neck.rotation.z = Math.PI;

  const filamentMaterial = new THREE.MeshStandardMaterial({
    color: "#8d6835",
    emissive: emissiveColor,
    emissiveIntensity: 0,
  });

  const filament = mesh(
    new THREE.TorusGeometry(0.09, 0.011, 6, 20, Math.PI * 1.7),
    filamentMaterial,
    group,
    [0, -0.18, 0.49]
  );
  filament.rotation.z = 0.35;

  for (const px of [-0.06, 0.06]) {
    mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.31, 5), brass, group, [
      px,
      -0.04,
      0.49,
    ]);
  }

  const light = new THREE.PointLight(emissiveColor, 0, 7.5, 2);
  light.position.set(0, -0.16, 0.82);
  light.castShadow = true;
  light.shadow.mapSize.set(512, 512);
  light.shadow.bias = -0.001;
  group.add(light);

  // Local additive halo in 3D space
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, haloColor);
  gradient.addColorStop(0.35, "rgba(255,160,50,0.18)");
  gradient.addColorStop(1, "rgba(255,160,50,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(canvas),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  sprite.position.set(0, -0.17, 0.49);
  sprite.scale.set(1.9, 1.9, 1.9);
  group.add(sprite);

  return { group, glassMaterial, filamentMaterial, light, sprite };
}
