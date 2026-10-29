'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { RopePhysics } from "@/lib/physics/ropePhysics";
import { ConnectionSound } from "@/lib/physics/connectionSound";
import { ROPE_WALL_CENTER_Z, WALL_FRONT_Z } from "@/lib/physics/sceneGeometry";
import { CableMesh } from "./CableMesh";
import { createBulb, createPlug, createSocket, createWallHinge } from "./models";
import type { ExperimentHandle, ExperimentState } from "./types";

type Props = {
  onState: (state: ExperimentState) => void;
  sound: boolean;
};

const INITIAL: ExperimentState = {
  connected: [false, false],
  connectedSocket: null,
  dragging: false,
  nearSocket: null,
  ready: false,
};

export const Experiment = forwardRef<ExperimentHandle, Props>(
  function Experiment({ onState, sound }, ref) {
    const host = useRef<HTMLDivElement>(null);
    const api = useRef<ExperimentHandle | null>(null);
    const change = useRef(onState);
    const soundRef = useRef(sound);
    const [error, setError] = useState(false);

    change.current = onState;
    soundRef.current = sound;

    useImperativeHandle(
      ref,
      () => ({
        reset: () => api.current?.reset(),
        connectTo: (socketIndex: number) => api.current?.connectTo(socketIndex),
        adjustDepth: delta => api.current?.adjustDepth(delta),
        setSound: value => api.current?.setSound(value),
      }),
      []
    );

    useEffect(() => {
      const element = host.current;
      if (!element) return;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        });
      } catch {
        setError(true);
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor("#f3efe6", 0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
      element.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-7.5, 7.5, 5, -5, 0.1, 70);
      camera.position.set(2.4, 5.0, 13.0);
      camera.lookAt(-0.1, 1.85, 0.2);

      const hemisphere = new THREE.HemisphereLight("#fff8e8", "#8c8071", 2.1);
      scene.add(hemisphere);

      const sun = new THREE.DirectionalLight("#fff5df", 3.1);
      sun.position.set(-4, 9, 6);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      Object.assign(sun.shadow.camera, {
        left: -10,
        right: 10,
        top: 10,
        bottom: -10,
        near: 1,
        far: 30,
      });
      sun.shadow.bias = -0.0006;
      sun.shadow.normalBias = 0.025;
      sun.shadow.radius = 4;
      scene.add(sun);

      const fill = new THREE.DirectionalLight("#fff9ef", 0.6);
      fill.position.set(5, 4, -1);
      scene.add(fill);

      // Floor & Wall
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(35, 35),
        new THREE.MeshStandardMaterial({ color: "#e8dfcd", roughness: 0.92 })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(30, 15, 0.2),
        new THREE.MeshStandardMaterial({ color: "#eee8dc", roughness: 0.95 })
      );
      wall.position.set(0, 7.5, WALL_FRONT_Z - 0.1);
      wall.receiveShadow = true;
      scene.add(wall);

      const skirting = new THREE.Mesh(
        new THREE.BoxGeometry(30, 0.095, 0.035),
        new THREE.MeshStandardMaterial({ color: "#ded5c5", roughness: 0.8 })
      );
      skirting.position.set(0, 0.047, -1.625);
      skirting.receiveShadow = true;
      scene.add(skirting);

      // Architectural hairline floor joints
      const jointMaterial = new THREE.MeshStandardMaterial({
        color: "#d7cdbb",
        transparent: true,
        opacity: 0.45,
        roughness: 1,
      });
      for (let z = -1; z < 9; z += 1.5) {
        const joint = new THREE.Mesh(
          new THREE.BoxGeometry(25, 0.001, 0.004),
          jointMaterial
        );
        joint.position.set(0, 0.002, z);
        scene.add(joint);
      }

      // Physics and Cable Setup for SINGLE-SIDED cable
      const physics = new RopePhysics();
      const cable = new CableMesh();
      scene.add(cable);

      // Wall-mounted swivel hinge where cable enters from outside the frame
      const wallHinge = createWallHinge(physics.baseAnchor);
      scene.add(wallHinge);

      // Single free plug at the end of the cable (index = physics.count - 1)
      const plugIndex = physics.count - 1;
      const plug = createPlug(0);
      scene.add(plug);

      // 2 Wall Sockets: 0 = Keeper, 1 = Seeker
      const socketPositions = [
        new THREE.Vector3(-2.05, 2.24, -1.17),
        new THREE.Vector3(1.72, 2.24, -1.17),
      ];
      const sockets = socketPositions.map((position, index) =>
        createSocket(position, index, index === 0 ? "#C49A55" : "#0891B2")
      );
      sockets.forEach(socket => scene.add(socket.group));

      // 2 Edison Bulbs
      const bulbs = [
        createBulb(-0.91, 2.45, "#f59e0b", "rgba(245,158,11,0.5)"), // Keeper amber bulb
        createBulb(2.86, 2.45, "#06b6d4", "rgba(6,182,212,0.5)"),   // Seeker electric cyan bulb
      ];
      bulbs.forEach(bulb => scene.add(bulb.group));

      // Single plug can only connect to one socket at a time
      let connectedSocket: number | null = null;

      const soundEngine = new ConnectionSound();
      soundEngine.enabled = soundRef.current;

      let state: ExperimentState = {
        ...INITIAL,
        connected: [false, false],
        connectedSocket: null,
        ready: true,
      };

      const emit = () =>
        change.current({
          ...state,
          connected: [...state.connected] as [boolean, boolean],
        });

      let drag: {
        index: number;
        isPlug: boolean;
        pointerId: number;
        plane: THREE.Plane;
        offset: THREE.Vector3;
        depth: number;
        clientX: number;
        clientY: number;
      } | null = null;

      let near: number | null = null;
      let active = true;
      let animation = 0;
      let lastTime = performance.now();
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const world = new THREE.Vector3();
      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);
      const plusZ = new THREE.Vector3(0, 0, 1);
      const tangent = new THREE.Vector3();
      const targetQuaternion = new THREE.Quaternion();
      const glow = [0, 0];

      function resize() {
        if (!element) return;
        const width = element.clientWidth;
        const height = element.clientHeight;
        if (!width || !height) return;
        const aspect = width / height;
        const viewWidth = aspect < 1 ? 12.0 : 13.8;
        camera.left = -viewWidth / 2;
        camera.right = viewWidth / 2;
        camera.top = viewWidth / aspect / 2;
        camera.bottom = -camera.top;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }

      const observer = new ResizeObserver(resize);
      observer.observe(element);
      resize();

      function screenPosition(point: THREE.Vector3) {
        if (!element) return { x: 0, y: 0 };
        const rect = element.getBoundingClientRect();
        const projected = point.clone().project(camera);
        return {
          x: rect.left + ((projected.x + 1) * rect.width) / 2,
          y: rect.top + ((1 - projected.y) * rect.height) / 2,
        };
      }

      function setRay(x: number, y: number) {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        pointer.set(
          ((x - rect.left) / rect.width) * 2 - 1,
          (-(y - rect.top) / rect.height) * 2 + 1
        );
        raycaster.setFromCamera(pointer, camera);
      }

      function pick(x: number, y: number): { index: number; isPlug: boolean } | null {
        // Direct click on either wall socket snaps and connects immediately
        for (let s = 0; s < 2; s++) {
          const sp = screenPosition(socketPositions[s]);
          if (Math.hypot(sp.x - x, sp.y - y) < 48) {
            connect(s);
            return null;
          }
        }

        // Generous pick target on the free plug (index = physics.count - 1)
        const plugPoint = screenPosition(physics.points[plugIndex]);
        const plugDist = Math.hypot(plugPoint.x - x, plugPoint.y - y);
        if (plugDist < 60) {
          return { index: plugIndex, isPlug: true };
        }

        // Generous pick targets along the wire segments (excluding index 0 anchored to the wall)
        let best = 38;
        let result: { index: number; isPlug: boolean } | null = null;
        for (let i = 1; i < physics.count; i++) {
          const screen = screenPosition(physics.points[i]);
          const distance = Math.hypot(screen.x - x, screen.y - y);
          if (distance < best) {
            best = distance;
            result = { index: i, isPlug: i === plugIndex };
          }
        }
        return result;
      }

      function disconnect() {
        if (connectedSocket === null) return;
        connectedSocket = null;
        state.connected = [false, false];
        state.connectedSocket = null;
        physics.clearAnchor(plugIndex);
        soundEngine.play(false);
        emit();
      }

      function connect(socket: number) {
        if (socket < 0 || socket > 1) return;
        connectedSocket = socket;
        state.connected = socket === 0 ? [true, false] : [false, true];
        state.connectedSocket = socket === 0 ? 'keeper' : 'seeker';
        physics.setAnchor(plugIndex, socketPositions[socket]);
        soundEngine.play(true);
        emit();
      }

      function pointerDown(event: PointerEvent) {
        if (event.button !== 0 || drag || !element) return;
        const picked = pick(event.clientX, event.clientY);
        if (!picked) return;
        event.preventDefault();
        element.focus({ preventScroll: true });

        // Unplug if currently plugged into a socket
        if (connectedSocket !== null) {
          disconnect();
        }

        const position = physics.points[picked.index].clone();
        const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
          cameraDirection,
          position
        );
        setRay(event.clientX, event.clientY);
        raycaster.ray.intersectPlane(plane, world);

        drag = {
          ...picked,
          pointerId: event.pointerId,
          plane,
          offset: position.clone().sub(world),
          depth: 0,
          clientX: event.clientX,
          clientY: event.clientY,
        };

        physics.setAnchor(picked.index, position);
        element.setPointerCapture(event.pointerId);
        element.style.cursor = "grabbing";
        state.dragging = true;
        state.nearSocket = null;
        emit();
      }

      function pointerMove(event: PointerEvent) {
        if (!element) return;
        if (!drag) {
          element.style.cursor = pick(event.clientX, event.clientY)
            ? "grab"
            : "default";
          return;
        }
        if (event.pointerId !== drag.pointerId) return;

        drag.clientX = event.clientX;
        drag.clientY = event.clientY;
        setRay(event.clientX, event.clientY);

        if (!raycaster.ray.intersectPlane(drag.plane, world)) return;
        const position = world.clone().add(drag.offset);
        position.x = THREE.MathUtils.clamp(position.x, -5.5, 5.5);
        position.y = THREE.MathUtils.clamp(
          position.y,
          drag.isPlug ? 0.18 : 0.08,
          4.6
        );
        position.z = THREE.MathUtils.clamp(
          position.z,
          drag.isPlug ? -1.17 : ROPE_WALL_CENTER_Z,
          5.5
        );

        // Enforce reach from the wall hinge base anchor (index 0)
        const maxReach = physics.totalLength * 0.99;
        if (position.distanceTo(physics.baseAnchor) > maxReach) {
          position
            .copy(physics.baseAnchor)
            .add(
              position.clone().sub(physics.baseAnchor).normalize().multiplyScalar(maxReach)
            );
        }

        near = null;
        if (drag.isPlug || drag.index >= plugIndex - 2) {
          for (let socket = 0; socket < 2; socket++) {
            const point = screenPosition(socketPositions[socket]);
            if (
              Math.hypot(event.clientX - point.x, event.clientY - point.y) < 88
            ) {
              near = socket;
              position.copy(socketPositions[socket]);
              break;
            }
          }
        }

        physics.setAnchor(drag.index, position);
        if (state.nearSocket !== near) {
          state.nearSocket = near;
          emit();
        }
      }

      function release(snap = true) {
        if (!drag || !element) return;
        const current = drag;
        drag = null;
        physics.clearAnchor(current.index);

        if (snap && (current.isPlug || current.index >= plugIndex - 2) && near !== null) {
          connect(near);
        }

        if (element.hasPointerCapture(current.pointerId)) {
          element.releasePointerCapture(current.pointerId);
        }

        near = null;
        state.dragging = false;
        state.nearSocket = null;
        element.style.cursor = "grab";
        emit();
      }

      const pointerUp = (event: PointerEvent) => {
        if (drag?.pointerId === event.pointerId) release();
      };

      const pointerCancel = (event: Event) => {
        if (event instanceof PointerEvent && drag?.pointerId !== event.pointerId) return;
        release(false);
      };

      function adjustDepth(delta: number) {
        if (!drag) return;
        const depth = THREE.MathUtils.clamp(drag.depth + delta, -2.2, 2.2);
        drag.plane.constant += depth - drag.depth;
        drag.depth = depth;
        pointerMove(
          new PointerEvent("pointermove", {
            clientX: drag.clientX,
            clientY: drag.clientY,
            pointerId: drag.pointerId,
          })
        );
      }

      function wheel(event: WheelEvent) {
        if (!drag) return;
        event.preventDefault();
        adjustDepth(THREE.MathUtils.clamp(event.deltaY * 0.004, -0.4, 0.4));
      }

      function key(event: KeyboardEvent) {
        if (event.key === "Escape") release(false);
        if (event.key.toLowerCase() === "r") {
          event.preventDefault();
          api.current?.reset();
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          // Toggle connection between sockets
          if (connectedSocket === null) {
            connect(0);
          } else if (connectedSocket === 0) {
            connect(1);
          } else {
            api.current?.reset();
          }
        }
      }

      function reset() {
        release(false);
        physics.reset();
        connectedSocket = null;
        state.connected = [false, false];
        state.connectedSocket = null;
        state.nearSocket = null;
        emit();
      }

      api.current = {
        reset,
        connectTo: (socketIndex: number) => {
          release(false);
          connect(socketIndex);
        },
        adjustDepth,
        setSound: value => {
          soundEngine.enabled = value;
        },
      };

      element.addEventListener("pointerdown", pointerDown);
      element.addEventListener("pointermove", pointerMove);
      element.addEventListener("pointerup", pointerUp);
      element.addEventListener("pointercancel", pointerCancel);
      element.addEventListener("lostpointercapture", pointerCancel);
      element.addEventListener("wheel", wheel, { passive: false });
      element.addEventListener("keydown", key);
      window.addEventListener("blur", pointerCancel);

      const contextLost = (event: Event) => {
        event.preventDefault();
        active = false;
        setError(true);
      };
      renderer.domElement.addEventListener("webglcontextlost", contextLost);
      emit();

      function frame(time: number) {
        if (!active) return;
        const dt = Math.min((time - lastTime) / 1000, 0.034);
        lastTime = time;

        physics.step(dt);
        cable.update(physics.points);

        // Update single plug position and orientation
        plug.position.copy(physics.points[plugIndex]);
        const isConnected = connectedSocket !== null;

        if (isConnected || (drag?.isPlug && near !== null)) {
          targetQuaternion.identity();
        } else {
          tangent.subVectors(
            physics.points[plugIndex - 2],
            physics.points[plugIndex]
          );
          if (physics.points[plugIndex].y < 0.25) tangent.y = 0;
          tangent.normalize();
          targetQuaternion.setFromUnitVectors(plusZ, tangent);
        }
        plug.quaternion.slerp(targetQuaternion, Math.min(dt * 13, 1));

        // Update bulbs and socket glowing target rings
        bulbs.forEach((bulb, index) => {
          const isBulbLit = connectedSocket === index;
          glow[index] = THREE.MathUtils.damp(
            glow[index],
            isBulbLit ? 1 : 0,
            8,
            dt
          );

          bulb.light.intensity = glow[index] * 9;
          bulb.glassMaterial.emissiveIntensity = glow[index] * 2.5;
          bulb.glassMaterial.opacity = 0.4 + glow[index] * 0.3;
          bulb.filamentMaterial.emissiveIntensity = glow[index] * 7.5;
          bulb.sprite.material.opacity = glow[index] * 0.85;

          // Socket ring pulse indicator when hovering/dragging near
          sockets[index].ring.material.opacity =
            near === index ? 0.7 + Math.sin(time * 0.006) * 0.25 : 0;
        });

        renderer.render(scene, camera);
        animation = requestAnimationFrame(frame);
      }

      animation = requestAnimationFrame(frame);

      return () => {
        active = false;
        cancelAnimationFrame(animation);
        observer.disconnect();
        element.removeEventListener("pointerdown", pointerDown);
        element.removeEventListener("pointermove", pointerMove);
        element.removeEventListener("pointerup", pointerUp);
        element.removeEventListener("pointercancel", pointerCancel);
        element.removeEventListener("lostpointercapture", pointerCancel);
        element.removeEventListener("wheel", wheel);
        element.removeEventListener("keydown", key);
        window.removeEventListener("blur", pointerCancel);
        renderer.domElement.removeEventListener("webglcontextlost", contextLost);
        soundEngine.dispose();

        scene.traverse(object => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            const materials = Array.isArray(object.material)
              ? object.material
              : [object.material];
            materials.forEach(material => material.dispose());
          }
          if (object instanceof THREE.Sprite) {
            object.material.map?.dispose();
            object.material.dispose();
          }
        });
        renderer.dispose();
        renderer.domElement.remove();
        api.current = null;
      };
    }, []);

    useEffect(() => api.current?.setSound(sound), [sound]);

    return (
      <div
        className="experiment-canvas w-full h-full touch-none select-none outline-none relative"
        ref={host}
        tabIndex={0}
        role="application"
        aria-label="Interactive 3D single-sided cable. Pick up the plug and drag it into Keeper Socket 01 or Seeker Socket 02. Scroll to adjust depth."
      >
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-amber-50 text-slate-800 text-center">
            <span className="font-bold">3D WebGL Needs Hardware Acceleration</span>
            <p className="text-xs text-slate-600 mt-1 max-w-sm">
              Please ensure hardware acceleration is active in your browser.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-1.5 rounded-lg bg-[#b64b2e] text-white text-xs font-bold"
            >
              Reload
            </button>
          </div>
        )}
      </div>
    );
  }
);
