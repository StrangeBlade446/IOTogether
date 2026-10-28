import * as THREE from "three";
import { CABLE_RADIUS } from "@/lib/physics/sceneGeometry";

export class CableMesh extends THREE.Mesh<
  THREE.BufferGeometry,
  THREE.MeshStandardMaterial
> {
  private readonly rings = 112;
  private readonly sides = 8;
  private readonly positions: Float32Array;
  private readonly normals: Float32Array;
  private readonly tangent = new THREE.Vector3();
  private readonly normal = new THREE.Vector3();
  private readonly binormal = new THREE.Vector3();
  private readonly frameUp = new THREE.Vector3(0, 1, 0);
  private readonly side = new THREE.Vector3(1, 0, 0);

  constructor() {
    super(
      new THREE.BufferGeometry(),
      new THREE.MeshStandardMaterial({
        color: "#b64b2e", // Rich terracotta/copper cable matching Livewire
        roughness: 0.64,
        metalness: 0.05,
      })
    );
    this.positions = new Float32Array((this.rings + 1) * this.sides * 3);
    this.normals = new Float32Array(this.positions.length);
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.positions, 3).setUsage(
        THREE.DynamicDrawUsage
      )
    );
    this.geometry.setAttribute(
      "normal",
      new THREE.BufferAttribute(this.normals, 3).setUsage(
        THREE.DynamicDrawUsage
      )
    );
    const indices: number[] = [];
    for (let i = 0; i < this.rings; i++) {
      for (let j = 0; j < this.sides; j++) {
        const a = i * this.sides + j;
        const b = i * this.sides + ((j + 1) % this.sides);
        const c = a + this.sides;
        const d = b + this.sides;
        indices.push(a, b, c, b, d, c);
      }
    }
    this.geometry.setIndex(indices);
    this.castShadow = true;
    this.receiveShadow = true;
    this.frustumCulled = false;
  }

  update(points: THREE.Vector3[]) {
    if (!points || points.length < 2) return;
    const curve = new THREE.CatmullRomCurve3(points, false, "centripetal");
    const sampled = curve.getPoints(this.rings);
    for (let i = 0; i <= this.rings; i++) {
      this.tangent
        .subVectors(
          sampled[Math.min(i + 1, this.rings)],
          sampled[Math.max(i - 1, 0)]
        )
        .normalize();
      this.normal
        .crossVectors(
          this.tangent,
          Math.abs(this.tangent.y) > 0.95 ? this.side : this.frameUp
        )
        .normalize();
      this.binormal.crossVectors(this.tangent, this.normal).normalize();
      for (let j = 0; j < this.sides; j++) {
        const angle = (j / this.sides) * Math.PI * 2;
        const nx =
          this.normal.x * Math.cos(angle) + this.binormal.x * Math.sin(angle);
        const ny =
          this.normal.y * Math.cos(angle) + this.binormal.y * Math.sin(angle);
        const nz =
          this.normal.z * Math.cos(angle) + this.binormal.z * Math.sin(angle);
        const k = (i * this.sides + j) * 3;
        this.positions[k] = sampled[i].x + nx * CABLE_RADIUS;
        this.positions[k + 1] = sampled[i].y + ny * CABLE_RADIUS;
        this.positions[k + 2] = sampled[i].z + nz * CABLE_RADIUS;
        this.normals[k] = nx;
        this.normals[k + 1] = ny;
        this.normals[k + 2] = nz;
      }
    }
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.normal.needsUpdate = true;
  }
}
