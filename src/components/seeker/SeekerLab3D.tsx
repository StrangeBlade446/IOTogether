'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Search,
  Cpu,
  Zap,
  Info,
  Maximize2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Bot,
} from 'lucide-react';

interface StationInfo {
  id: string;
  name: string;
  category: string;
  items: string[];
  color: string;
  position: [number, number, number];
}

const STATIONS: StationInfo[] = [
  {
    id: 'mcu',
    name: 'Microcontrollers & SBCs',
    category: 'microcontrollers',
    items: ['Arduino Mega 2560', 'Raspberry Pi 4 (8GB)', 'ESP32 NodeMCU DevKit', 'RP2040 Pico'],
    color: '#0891B2',
    position: [-5.2, 0, -4.5],
  },
  {
    id: 'sensors',
    name: 'Sensor Array & Probes',
    category: 'sensors',
    items: ['RPLiDAR A1 360°', 'BME280 Temp/Humidity', 'MPU-6050 6-Axis IMU', 'HC-SR04 Ultrasonic'],
    color: '#16A34A',
    position: [5.2, 0, -4.5],
  },
  {
    id: 'test',
    name: 'Test & Measurement Bench',
    category: 'test_equipment',
    items: ['Rigol DS1054Z 50MHz Scope', 'Siglent Arbitrary Wave Gen', 'Fluke 117 True-RMS Meter'],
    color: '#D97706',
    position: [-5.2, 0, 4.0],
  },
  {
    id: 'robotics',
    name: 'Robotics & Actuators',
    category: 'actuators_motors',
    items: ['NEMA 17 Stepper Motors', 'MG996R Metal Gear Servos', 'TB6600 Driver Boards'],
    color: '#9333EA',
    position: [5.2, 0, 4.0],
  },
];

export function SeekerLab3D() {
  const router = useRouter();
  const host = useRef<HTMLDivElement>(null);
  const [activeStation, setActiveStation] = useState<StationInfo | null>(null);
  const [droidHovered, setDroidHovered] = useState(false);

  // Keyboard navigation input state
  const keys = useRef<{ [k: string]: boolean }>({});

  const handleWalk = (direction: 'forward' | 'backward' | 'left' | 'right', active: boolean) => {
    const map = {
      forward: 'KeyW',
      backward: 'KeyS',
      left: 'KeyA',
      right: 'KeyD',
    };
    keys.current[map[direction]] = active;
  };

  useEffect(() => {
    const element = host.current;
    if (!element) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor('#ede7dc', 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    element.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('#ede7dc', 14, 34);

    // First-person walkable camera
    const camera = new THREE.PerspectiveCamera(54, 1, 0.1, 60);
    camera.position.set(0, 1.7, 7.0);

    let yaw = 0;
    let pitch = -0.05;

    // Movement parameters
    const playerSpeed = 5.2;
    const playerRadius = 0.6;

    // Standard materials
    const floorTileMat = new THREE.MeshStandardMaterial({
      color: '#ded6c7',
      roughness: 0.45,
      metalness: 0.1,
    });
    const wallPanelMat = new THREE.MeshStandardMaterial({
      color: '#ebe4d8',
      roughness: 0.9,
    });
    const benchWoodMat = new THREE.MeshStandardMaterial({
      color: '#4a3528',
      roughness: 0.65,
    });
    const benchMetalMat = new THREE.MeshStandardMaterial({
      color: '#28302c',
      roughness: 0.4,
      metalness: 0.8,
    });

    function addMesh(
      parent: THREE.Object3D,
      geom: THREE.BufferGeometry,
      mat: THREE.Material,
      pos: [number, number, number],
      rot?: [number, number, number]
    ) {
      const m = new THREE.Mesh(geom, mat);
      m.position.set(...pos);
      if (rot) m.rotation.set(...rot);
      m.castShadow = true;
      m.receiveShadow = true;
      parent.add(m);
      return m;
    }

    // 1. Room Shell (Floor, Ceiling, Walls)
    const room = new THREE.Group();
    scene.add(room);

    // Floor
    const floor = addMesh(
      room,
      new THREE.PlaneGeometry(28, 28),
      floorTileMat,
      [0, 0, 0],
      [-Math.PI / 2, 0, 0]
    );

    // Subtle grid lines on floor
    const gridJointMat = new THREE.MeshStandardMaterial({
      color: '#c9beac',
      transparent: true,
      opacity: 0.35,
      roughness: 1,
    });
    for (let i = -13; i <= 13; i += 2.5) {
      addMesh(room, new THREE.BoxGeometry(28, 0.002, 0.015), gridJointMat, [0, 0.001, i]);
      addMesh(room, new THREE.BoxGeometry(0.015, 0.002, 28), gridJointMat, [i, 0.001, 0]);
    }

    // 4 Room Walls
    addMesh(room, new THREE.BoxGeometry(28, 6, 0.3), wallPanelMat, [0, 3, -14]); // Back
    addMesh(room, new THREE.BoxGeometry(28, 6, 0.3), wallPanelMat, [0, 3, 14]); // Front
    addMesh(room, new THREE.BoxGeometry(0.3, 6, 28), wallPanelMat, [-14, 3, 0]); // Left
    addMesh(room, new THREE.BoxGeometry(0.3, 6, 28), wallPanelMat, [14, 3, 0]); // Right

    // Ceiling LED Light Panels
    for (const z of [-6, 0, 6]) {
      for (const x of [-5, 5]) {
        const lightFixture = addMesh(
          room,
          new THREE.BoxGeometry(2.4, 0.08, 1.2),
          new THREE.MeshStandardMaterial({
            color: '#ffffff',
            emissive: '#fff2db',
            emissiveIntensity: 0.8,
            roughness: 0.1,
          }),
          [x, 5.9, z]
        );
        const ceilingLight = new THREE.PointLight('#fff2db', 0.8, 10, 2);
        ceilingLight.position.set(x, 5.4, z);
        room.add(ceilingLight);
      }
    }

    // 2. Hardware Stations in the 4 corners of the lab
    function createStation(station: StationInfo) {
      const group = new THREE.Group();
      group.position.set(...station.position);

      // Heavy ESD Workbench Table
      addMesh(group, new THREE.BoxGeometry(3.6, 0.18, 2.2), benchWoodMat, [0, 0.85, 0]);
      // Metal Frame Legs
      addMesh(group, new THREE.BoxGeometry(0.12, 1.7, 0.12), benchMetalMat, [-1.6, 0, -0.9]);
      addMesh(group, new THREE.BoxGeometry(0.12, 1.7, 0.12), benchMetalMat, [1.6, 0, -0.9]);
      addMesh(group, new THREE.BoxGeometry(0.12, 1.7, 0.12), benchMetalMat, [-1.6, 0, 0.9]);
      addMesh(group, new THREE.BoxGeometry(0.12, 1.7, 0.12), benchMetalMat, [1.6, 0, 0.9]);

      // ESD Anti-Static Mat
      addMesh(
        group,
        new THREE.BoxGeometry(3.2, 0.015, 1.8),
        new THREE.MeshStandardMaterial({ color: '#273832', roughness: 0.6 }),
        [0, 0.95, 0]
      );

      // Equipment Boxes / Models on Table
      addMesh(
        group,
        new RoundedBoxGeometry(0.9, 0.45, 0.6, 3, 0.04),
        new THREE.MeshStandardMaterial({ color: '#38423d', roughness: 0.4 }),
        [-0.8, 1.2, -0.2]
      );
      addMesh(
        group,
        new RoundedBoxGeometry(0.6, 0.35, 0.4, 3, 0.04),
        new THREE.MeshStandardMaterial({ color: station.color, roughness: 0.3, emissive: station.color, emissiveIntensity: 0.2 }),
        [0.8, 1.15, 0.2]
      );

      // Floating Hologram Header Billboard
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 160;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'rgba(26, 34, 30, 0.9)';
      ctx.roundRect(10, 10, 492, 140, 20);
      ctx.fill();
      ctx.strokeStyle = station.color;
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = station.color;
      ctx.font = "bold 28px 'DM Mono', monospace";
      ctx.fillText(station.name.toUpperCase(), 32, 60);

      ctx.fillStyle = '#e4dfd5';
      ctx.font = "20px 'DM Sans', sans-serif";
      ctx.fillText(`${station.items.length} Instruments Available`, 32, 105);

      const billboardTex = new THREE.CanvasTexture(canvas);
      billboardTex.colorSpace = THREE.SRGBColorSpace;
      const billboard = new THREE.Mesh(
        new THREE.PlaneGeometry(2.4, 0.75),
        new THREE.MeshBasicMaterial({ map: billboardTex, transparent: true })
      );
      billboard.position.set(0, 2.5, 0);
      group.add(billboard);

      // Pulsing floor proximity ring
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(2.2, 2.35, 32),
        new THREE.MeshBasicMaterial({ color: station.color, side: THREE.DoubleSide, transparent: true, opacity: 0.4 })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.01;
      group.add(ring);

      return { group, billboard, ring };
    }

    const stationMeshes = STATIONS.map(createStation);
    stationMeshes.forEach((s) => scene.add(s.group));

    // 3. Mini Droid ("Scientific Chef") in Center of Lab
    const droidGroup = new THREE.Group();
    droidGroup.position.set(0, 1.35, -0.5);
    scene.add(droidGroup);

    // Chrome/Cyan Spherical Body
    const droidBody = addMesh(
      droidGroup,
      new THREE.SphereGeometry(0.42, 32, 24),
      new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        metalness: 0.85,
        roughness: 0.15,
      }),
      [0, 0, 0]
    );

    // Glowing LED Cyclops Visor Eye
    const droidEye = addMesh(
      droidGroup,
      new THREE.CylinderGeometry(0.18, 0.18, 0.08, 24),
      new THREE.MeshStandardMaterial({
        color: '#06B6D4',
        emissive: '#06B6D4',
        emissiveIntensity: 1.8,
        roughness: 0.1,
      }),
      [0, 0.06, 0.38]
    );
    droidEye.rotation.x = Math.PI / 2;

    // Mini Chef Hat on Droid
    const chefHatBase = addMesh(
      droidGroup,
      new THREE.CylinderGeometry(0.24, 0.26, 0.12, 24),
      new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9 }),
      [0, 0.44, 0]
    );
    const chefHatTop = addMesh(
      droidGroup,
      new THREE.SphereGeometry(0.32, 24, 16),
      new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9 }),
      [0, 0.62, 0]
    );
    chefHatTop.scale.set(1.1, 0.85, 1.1);

    // Rotating Levitation Ring beneath Droid
    const levitationRing = addMesh(
      droidGroup,
      new THREE.TorusGeometry(0.52, 0.035, 12, 36),
      new THREE.MeshStandardMaterial({
        color: '#0891B2',
        emissive: '#06B6D4',
        emissiveIntensity: 1.2,
        roughness: 0.2,
      }),
      [0, -0.32, 0]
    );
    levitationRing.rotation.x = Math.PI / 2;

    // Mini Droid Light
    const droidLight = new THREE.PointLight('#06B6D4', 2.0, 5, 2);
    droidLight.position.set(0, 0.1, 0.5);
    droidGroup.add(droidLight);

    // Invisible Hit Target on Droid for Click Interaction
    const droidHitBox = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 12, 10),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    droidHitBox.userData.isDroid = true;
    droidGroup.add(droidHitBox);

    // Floating Hologram Speech Billboard above Droid ("Scientific Chef")
    const droidCanvas = document.createElement('canvas');
    droidCanvas.width = 512;
    droidCanvas.height = 200;
    const dctx = droidCanvas.getContext('2d')!;
    dctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    dctx.roundRect(10, 10, 492, 180, 24);
    dctx.fill();
    dctx.strokeStyle = '#06B6D4';
    dctx.lineWidth = 4;
    dctx.stroke();

    dctx.fillStyle = '#06B6D4';
    dctx.font = "bold 32px 'DM Mono', monospace";
    dctx.fillText('✨ SCIENTIFIC CHEF', 34, 68);

    dctx.fillStyle = '#f8fafc';
    dctx.font = "24px 'DM Sans', sans-serif";
    dctx.fillText('Need an AI Project Recipe?', 34, 118);

    dctx.fillStyle = '#C49A55';
    dctx.font = "bold 20px 'DM Mono', monospace";
    dctx.fillText('CLICK ME TO BROWSE RECIPES →', 34, 158);

    const droidTex = new THREE.CanvasTexture(droidCanvas);
    droidTex.colorSpace = THREE.SRGBColorSpace;
    const droidBillboard = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 1.05),
      new THREE.MeshBasicMaterial({ map: droidTex, transparent: true })
    );
    droidBillboard.position.set(0, 1.45, 0);
    droidGroup.add(droidBillboard);

    // 4. Lighting Setup
    const ambient = new THREE.HemisphereLight('#fff5e8', '#554238', 1.8);
    scene.add(ambient);

    const dirSun = new THREE.DirectionalLight('#fff0d8', 2.8);
    dirSun.position.set(-6, 12, 6);
    dirSun.castShadow = true;
    dirSun.shadow.mapSize.set(2048, 2048);
    scene.add(dirSun);

    // 5. Look & Drag Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: PointerEvent) => {
      // Check if user clicked on the Droid
      const rect = element.getBoundingClientRect();
      const pointer = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(droidHitBox, false);

      if (hits.length > 0) {
        // Clicked on the Scientific Chef Droid!
        router.push('/receiver/project-recipe');
        return;
      }

      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      element.setPointerCapture(e.pointerId);
    };

    let isDroidHovering = false;
    let lastStationId: string | null = null;

    const onPointerMove = (e: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const pointer = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(droidHitBox, false);

      isDroidHovering = hits.length > 0;
      element.style.cursor = isDroidHovering ? 'pointer' : isDragging ? 'grabbing' : 'grab';

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        yaw -= deltaX * 0.0035;
        pitch = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, pitch - deltaY * 0.0035));
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      if (element.hasPointerCapture(e.pointerId)) {
        element.releasePointerCapture(e.pointerId);
      }
      element.style.cursor = 'grab';
    };

    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointermove', onPointerMove);
    element.addEventListener('pointerup', onPointerUp);
    element.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    function resize() {
      if (!element) return;
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();

    // 6. Animation Frame Loop with Movement Integration
    let isRunning = true;
    let animId = 0;
    let lastTime = performance.now();

    function animate(time: number) {
      if (!isRunning) return;
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      // Camera view rotation
      camera.quaternion.setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));

      // Player Movement Direction Vector
      const forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, yaw, 0));
      const right = new THREE.Vector3(1, 0, 0).applyEuler(new THREE.Euler(0, yaw, 0));
      const move = new THREE.Vector3(0, 0, 0);

      if (keys.current['KeyW'] || keys.current['ArrowUp']) move.add(forward);
      if (keys.current['KeyS'] || keys.current['ArrowDown']) move.sub(forward);
      if (keys.current['KeyD'] || keys.current['ArrowRight']) move.add(right);
      if (keys.current['KeyA'] || keys.current['ArrowLeft']) move.sub(right);

      if (move.lengthSq() > 0) {
        move.normalize().multiplyScalar(playerSpeed * dt);
        camera.position.add(move);

        // Clamp to room bounds
        camera.position.x = Math.max(-11.5, Math.min(11.5, camera.position.x));
        camera.position.z = Math.max(-11.5, Math.min(11.5, camera.position.z));
      }

      // Check proximity to stations
      let nearestStation: StationInfo | null = null;
      let nearestDist = 3.6;

      STATIONS.forEach((station) => {
        const stationPos = new THREE.Vector3(...station.position);
        const dist = camera.position.distanceTo(stationPos);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestStation = station;
        }
      });
      if ((nearestStation as StationInfo | null)?.id !== lastStationId) {
        lastStationId = (nearestStation as StationInfo | null)?.id || null;
        setActiveStation(nearestStation);
      }

      // Animate Billboards to face camera
      stationMeshes.forEach((s) => {
        s.billboard.quaternion.copy(camera.quaternion);
      });
      droidBillboard.quaternion.copy(camera.quaternion);

      // Animate Mini Droid Hover & Rotation
      const bob = Math.sin(time * 0.0025) * 0.12;
      droidGroup.position.y = 1.35 + bob;
      levitationRing.rotation.z = time * 0.004;

      if (isDroidHovering) {
        droidGroup.rotation.y += dt * 4.0;
        droidLight.intensity = 3.5;
      } else {
        droidGroup.rotation.y = Math.sin(time * 0.001) * 0.25;
        droidLight.intensity = 2.0;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      observer.disconnect();
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('pointermove', onPointerMove);
      element.removeEventListener('pointerup', onPointerUp);
      element.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            if (m instanceof THREE.MeshBasicMaterial || m instanceof THREE.MeshStandardMaterial) {
              m.map?.dispose();
            }
            m.dispose();
          });
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [router]);

  return (
    <div className="relative w-full h-[620px] rounded-3xl overflow-hidden border border-[#dcd7cb] bg-[#ede7dc] shadow-2xl select-none">
      {/* 3D WebGL Canvas */}
      <div ref={host} className="w-full h-full cursor-grab active:cursor-grabbing outline-none" tabIndex={0} />

      {/* Top HUD: Controls & Droid Notice */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 text-xs font-mono text-slate-800 backdrop-blur-md shadow-sm pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-[#0891B2] animate-pulse" />
          <span className="font-bold">3D WALKABLE LAB</span>
          <span className="text-slate-400">&bull;</span>
          <span className="text-slate-600">WASD / ARROWS TO WALK &bull; DRAG TO LOOK</span>
        </div>

        <button
          type="button"
          onClick={() => router.push('/receiver/project-recipe')}
          className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/85 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-200 text-xs font-mono font-bold shadow-md transition-all group"
        >
          <Bot className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
          <span>Scientific Chef Droid</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
        </button>
      </div>

      {/* Center Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40">
        <div className="w-3 h-3 rounded-full border border-slate-900" />
      </div>

      {/* Proximity Station Popup Card when near any bench */}
      {activeStation && (
        <div className="absolute bottom-6 left-6 z-20 max-w-sm p-4 rounded-2xl bg-white/95 border border-slate-300 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between mb-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: activeStation.color }}
            >
              {activeStation.category}
            </span>
            <span className="text-[10px] font-mono text-slate-500">NEARBY BENCH</span>
          </div>

          <h3 className="font-bold text-slate-900 text-sm mb-1">{activeStation.name}</h3>

          <div className="space-y-1 my-2.5">
            {activeStation.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => router.push(`/receiver/explore?category=${activeStation.category}`)}
            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <span>Browse &amp; Book Items from this Bench</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Virtual Touch On-Screen D-Pad for Mobile & Quick Walking */}
      <div className="absolute bottom-6 right-6 z-10 flex flex-col items-center gap-1 select-none pointer-events-auto">
        <button
          type="button"
          onMouseDown={() => handleWalk('forward', true)}
          onMouseUp={() => handleWalk('forward', false)}
          onTouchStart={() => handleWalk('forward', true)}
          onTouchEnd={() => handleWalk('forward', false)}
          className="w-10 h-10 rounded-xl bg-white/85 active:bg-cyan-100 border border-slate-300 shadow-sm flex items-center justify-center text-slate-700 active:text-cyan-700 transition"
          title="Walk Forward (W)"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onMouseDown={() => handleWalk('left', true)}
            onMouseUp={() => handleWalk('left', false)}
            onTouchStart={() => handleWalk('left', true)}
            onTouchEnd={() => handleWalk('left', false)}
            className="w-10 h-10 rounded-xl bg-white/85 active:bg-cyan-100 border border-slate-300 shadow-sm flex items-center justify-center text-slate-700 active:text-cyan-700 transition"
            title="Strafe Left (A)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onMouseDown={() => handleWalk('backward', true)}
            onMouseUp={() => handleWalk('backward', false)}
            onTouchStart={() => handleWalk('backward', true)}
            onTouchEnd={() => handleWalk('backward', false)}
            className="w-10 h-10 rounded-xl bg-white/85 active:bg-cyan-100 border border-slate-300 shadow-sm flex items-center justify-center text-slate-700 active:text-cyan-700 transition"
            title="Walk Backward (S)"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
          <button
            type="button"
            onMouseDown={() => handleWalk('right', true)}
            onMouseUp={() => handleWalk('right', false)}
            onTouchStart={() => handleWalk('right', true)}
            onTouchEnd={() => handleWalk('right', false)}
            className="w-10 h-10 rounded-xl bg-white/85 active:bg-cyan-100 border border-slate-300 shadow-sm flex items-center justify-center text-slate-700 active:text-cyan-700 transition"
            title="Strafe Right (D)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
