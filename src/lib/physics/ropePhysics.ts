import { CatmullRomCurve3, Vector3 } from "three";
import { ROPE_WALL_CENTER_Z } from "./sceneGeometry";

/**
 * Position-based dynamics Verlet solver for a single-sided cable.
 * Index 0 is anchored to the floor junction terminal.
 * Index (count - 1) is the single free grabbable plug.
 */
export class RopePhysics {
  public readonly count = 61;
  public readonly totalLength = 12.2;
  public points: Vector3[] = [];
  public previous: Vector3[] = [];
  public anchors = new Map<number, Vector3>();

  // Wall-mounted swivel hinge anchor (hooked high on the wall / outside left frame)
  public readonly baseAnchor = new Vector3(-4.4, 3.4, -1.38);

  private readonly segmentLength = this.totalLength / (this.count - 1);
  private readonly fixedStep = 1 / 120;
  private readonly maxFrameTime = 1 / 20;
  private readonly constraintIterations = 16;
  private readonly gravity = -9.81;
  private readonly airDamping = 0.994;
  private readonly floorFriction = 0.68;
  private readonly distanceStiffness = 0.92;
  private readonly bendStiffness = 0.045;
  private readonly maxConstraintCorrection = this.segmentLength * 0.75;

  public constructor() {
    this.reset();
  }

  public reset(): void {
    this.anchors.clear();

    // Natural catenary drape from the wall hinge down onto the floor
    const controls = [
      this.baseAnchor.clone(),
      new Vector3(-3.8, 2.3, -0.7),
      new Vector3(-3.1, 0.9, 0.1),
      new Vector3(-2.2, 0.09, 1.1),
      new Vector3(-0.8, 0.09, 1.7),
      new Vector3(0.9, 0.09, 1.4),
      new Vector3(1.9, 0.09, 0.6),
    ];
    const curve = new CatmullRomCurve3(controls, false, "centripetal");
    curve.arcLengthDivisions = 2000;
    const sampled = curve.getSpacedPoints(this.count - 1);

    const sampledLength = RopePhysics.polylineLength(sampled);
    const scale = this.totalLength / Math.max(0.1, sampledLength);

    this.points = sampled.map((p, i) => {
      if (i === 0) return this.baseAnchor.clone();
      return new Vector3(
        this.baseAnchor.x + (p.x - this.baseAnchor.x) * scale,
        Math.max(0.08, p.y),
        this.baseAnchor.z + (p.z - this.baseAnchor.z) * scale
      );
    });

    this.previous = this.points.map(p => p.clone());

    // Permanently pin the single-sided cable's wall hinge (Index 0)
    this.anchors.set(0, this.baseAnchor.clone());
  }

  public setAnchor(index: number, position: Vector3): void {
    this.assertIndex(index);
    if (!RopePhysics.isFiniteVector(position)) {
      throw new TypeError("Rope anchor position must contain finite coordinates.");
    }
    const anchor = position.clone();
    this.anchors.set(index, anchor);
    this.points[index].copy(anchor);
    this.previous[index].copy(anchor);
  }

  public clearAnchor(index: number): void {
    this.assertIndex(index);
    // Index 0 is the permanent base anchor of the single-sided cable
    if (index === 0) {
      this.anchors.set(0, this.baseAnchor.clone());
      return;
    }
    this.anchors.delete(index);
    this.previous[index].copy(this.points[index]);
  }

  public step(dtSeconds: number): void {
    if (!Number.isFinite(dtSeconds) || dtSeconds <= 0) {
      this.enforceAnchors();
      return;
    }

    const elapsed = Math.min(dtSeconds, this.maxFrameTime);
    const substeps = Math.max(1, Math.ceil(elapsed / this.fixedStep));
    const dt = elapsed / substeps;

    for (let step = 0; step < substeps; step += 1) {
      this.integrate(dt);

      for (let iteration = 0; iteration < this.constraintIterations; iteration += 1) {
        this.solveSegmentConstraints();
        this.solveBendingConstraints();
        this.enforceAnchors();
        this.constrainAll(false);
      }

      this.enforceAnchors();
      this.constrainAll(true);
      this.enforceAnchors();
    }
  }

  private integrate(dt: number): void {
    const gravityDisplacement = this.gravity * dt * dt;

    for (let index = 0; index < this.count; index += 1) {
      if (this.anchors.has(index)) {
        continue;
      }

      const point = this.points[index];
      const previous = this.previous[index];

      if (!RopePhysics.isFiniteVector(point) || !RopePhysics.isFiniteVector(previous)) {
        previous.copy(point.set(0, this.minimumY(index), 1.8));
        continue;
      }

      const velocityX = (point.x - previous.x) * this.airDamping;
      const velocityY = (point.y - previous.y) * this.airDamping;
      const velocityZ = (point.z - previous.z) * this.airDamping;

      previous.copy(point);
      point.x += velocityX;
      point.y += velocityY + gravityDisplacement;
      point.z += velocityZ;
    }
  }

  private solveSegmentConstraints(): void {
    for (let index = 0; index < this.count - 1; index += 1) {
      this.solveDistance(index, index + 1, this.segmentLength, this.distanceStiffness);
    }
    for (let index = this.count - 2; index >= 0; index -= 1) {
      this.solveDistance(index, index + 1, this.segmentLength, this.distanceStiffness);
    }
  }

  private solveBendingConstraints(): void {
    const bendLength = this.segmentLength * 2;
    for (let index = 0; index < this.count - 2; index += 1) {
      this.solveDistance(index, index + 2, bendLength, this.bendStiffness);
    }
  }

  private solveDistance(
    firstIndex: number,
    secondIndex: number,
    desiredLength: number,
    stiffness: number
  ): void {
    const first = this.points[firstIndex];
    const second = this.points[secondIndex];
    const deltaX = second.x - first.x;
    const deltaY = second.y - first.y;
    const deltaZ = second.z - first.z;
    const distance = Math.hypot(deltaX, deltaY, deltaZ);

    if (!Number.isFinite(distance) || distance < 1e-7) {
      return;
    }

    const firstPinned = this.anchors.has(firstIndex);
    const secondPinned = this.anchors.has(secondIndex);
    if (firstPinned && secondPinned) {
      return;
    }

    const lengthError = Math.max(
      -this.maxConstraintCorrection,
      Math.min(this.maxConstraintCorrection, distance - desiredLength)
    );
    const correction = (lengthError / distance) * stiffness;

    if (firstPinned) {
      second.x -= deltaX * correction;
      second.y -= deltaY * correction;
      second.z -= deltaZ * correction;
    } else if (secondPinned) {
      first.x += deltaX * correction;
      first.y += deltaY * correction;
      first.z += deltaZ * correction;
    } else {
      const halfCorrection = correction * 0.5;
      first.x += deltaX * halfCorrection;
      first.y += deltaY * halfCorrection;
      first.z += deltaZ * halfCorrection;
      second.x -= deltaX * halfCorrection;
      second.y -= deltaY * halfCorrection;
      second.z -= deltaZ * halfCorrection;
    }
  }

  private constrainAll(syncPrevious: boolean): void {
    for (let index = 0; index < this.count; index += 1) {
      if (!this.anchors.has(index)) {
        this.constrainPoint(index, syncPrevious);
      }
    }
  }

  private constrainPoint(index: number, syncPrevious: boolean): void {
    const point = this.points[index];
    const previous = this.previous[index];
    const minimumY = this.minimumY(index);
    let touchedFloor = false;
    let touchedWall = false;
    let touchedXBound = false;
    let touchedZBound = false;

    if (point.y < minimumY) {
      point.y = minimumY;
      touchedFloor = true;
    }
    if (point.z < ROPE_WALL_CENTER_Z) {
      point.z = ROPE_WALL_CENTER_Z;
      touchedWall = true;
    }
    if (point.x < -6) {
      point.x = -6;
      touchedXBound = true;
    } else if (point.x > 6) {
      point.x = 6;
      touchedXBound = true;
    }
    if (point.z > 6) {
      point.z = 6;
      touchedZBound = true;
    }

    if (!syncPrevious) {
      return;
    }

    if (touchedFloor) {
      const velocityX = point.x - previous.x;
      const velocityZ = point.z - previous.z;
      previous.x = point.x - velocityX * this.floorFriction;
      previous.y = point.y;
      previous.z = point.z - velocityZ * this.floorFriction;
    }
    if (touchedWall || touchedZBound) {
      previous.z = point.z;
    }
    if (touchedXBound) {
      previous.x = point.x;
    }
  }

  private enforceAnchors(): void {
    for (const [index, anchor] of this.anchors) {
      this.points[index].copy(anchor);
      this.previous[index].copy(anchor);
    }
  }

  private minimumY(index: number): number {
    return index === this.count - 1 ? 0.18 : 0.075;
  }

  private assertIndex(index: number): void {
    if (!Number.isInteger(index) || index < 0 || index >= this.count) {
      throw new RangeIndexError(`Point index ${index} out of range (0-${this.count - 1})`);
    }
  }

  private static polylineLength(points: Vector3[]): number {
    let total = 0;
    for (let i = 0; i < points.length - 1; i += 1) {
      total += points[i].distanceTo(points[i + 1]);
    }
    return total;
  }

  private static isFiniteVector(v: Vector3): boolean {
    return Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.z);
  }
}

class RangeIndexError extends RangeError {}
