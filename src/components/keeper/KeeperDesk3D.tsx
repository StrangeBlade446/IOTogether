'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {
  Boxes,
  QrCode,
  Layers,
  Bell,
  ScrollText,
  Eye,
  LayoutGrid,
  ShieldCheck,
  UserCheck,
  Building,
} from 'lucide-react';

export type KeeperCardOption = {
  id: string;
  label: string;
  detail: string;
  tone: string;
  href: string;
  badge?: number | string;
};

interface KeeperDesk3DProps {
  pendingRequestsCount: number;
  activeLoansCount: number;
  inventoryCount: number;
  unreadNotifsCount: number;
  profileName: string;
  instituteName: string;
  roleDesignation: string;
}

export function KeeperDesk3D({
  pendingRequestsCount,
  activeLoansCount,
  inventoryCount,
  unreadNotifsCount,
  profileName,
  instituteName,
  roleDesignation,
}: KeeperDesk3DProps) {
  const router = useRouter();
  const host = useRef<HTMLDivElement>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const KEEPER_OPTIONS: KeeperCardOption[] = [
    {
      id: 'inventory',
      label: 'Inventory Registry',
      detail: `${inventoryCount} INSTRUMENTS`,
      tone: '#C49A55',
      href: '/sender/inventory',
      badge: inventoryCount,
    },
    {
      id: 'requests',
      label: 'ID Verification & QR',
      detail: `${pendingRequestsCount} PENDING`,
      tone: '#0891B2',
      href: '/sender/requests',
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} NEW` : undefined,
    },
    {
      id: 'loans',
      label: 'Active Loans & Timers',
      detail: `${activeLoansCount} CHECKED OUT`,
      tone: '#16A34A',
      href: '/sender/loans',
      badge: activeLoansCount,
    },
    {
      id: 'notifications',
      label: 'Notification Center',
      detail: 'DISPATCH LOG',
      tone: '#D97706',
      href: '/notifications',
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined,
    },
    {
      id: 'audit',
      label: 'Audit Ledger',
      detail: 'CHAIN OF CUSTODY',
      tone: '#64748B',
      href: '/admin/audit',
    },
  ];

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
    scene.fog = new THREE.Fog('#ede7dc', 12, 28);

    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 50);
    camera.position.set(0, 2.35, 6.2);
    const lookAt = new THREE.Vector3(0, 1.25, -1.35);
    const desiredLook = lookAt.clone();
    camera.lookAt(lookAt);

    // Standard Materials
    const deskWalnut = new THREE.MeshStandardMaterial({ color: '#54382b', roughness: 0.65 });
    const deskEdgeMat = new THREE.MeshStandardMaterial({ color: '#3d251a', roughness: 0.55 });
    const darkChassis = new THREE.MeshStandardMaterial({ color: '#222825', roughness: 0.45, metalness: 0.15 });
    const brassMat = new THREE.MeshStandardMaterial({ color: '#b18857', roughness: 0.28, metalness: 0.75 });
    const paperMat = new THREE.MeshStandardMaterial({ color: '#ede7db', roughness: 0.92 });
    const oscilloscopeMat = new THREE.MeshStandardMaterial({ color: '#323b38', roughness: 0.4 });

    function addMesh(
      parent: THREE.Object3D,
      geometry: THREE.BufferGeometry,
      material: THREE.Material,
      position: [number, number, number],
      rotation?: [number, number, number]
    ) {
      const obj = new THREE.Mesh(geometry, material);
      obj.position.set(...position);
      if (rotation) obj.rotation.set(...rotation);
      obj.castShadow = true;
      obj.receiveShadow = true;
      parent.add(obj);
      return obj;
    }

    // 1. Room Back Wall & Architectural Panels
    const room = new THREE.Group();
    scene.add(room);
    const backWall = addMesh(
      room,
      new THREE.BoxGeometry(18, 12, 0.25),
      new THREE.MeshStandardMaterial({ color: '#e8dfd1', roughness: 0.95 }),
      [0, 5, -5.6]
    );
    backWall.receiveShadow = true;

    // Window / Wall blueprint art on back wall
    const wallArt = addMesh(
      room,
      new THREE.PlaneGeometry(6, 3),
      new THREE.MeshStandardMaterial({ color: '#dfd6c5', roughness: 0.8 }),
      [0, 5.2, -5.45]
    );
    wallArt.receiveShadow = true;

    // 2. Heavy Laboratory Workbench
    const desk = new THREE.Group();
    scene.add(desk);
    addMesh(desk, new THREE.BoxGeometry(13, 0.24, 8.5), deskWalnut, [0, 0.57, -1.45]);
    addMesh(desk, new THREE.BoxGeometry(13, 0.68, 0.18), deskEdgeMat, [0, 0.13, 2.6]);
    // 4 Heavy Sturdy Legs
    addMesh(desk, new THREE.BoxGeometry(0.22, 3.8, 0.22), deskEdgeMat, [-5.6, -1.15, 1.9]);
    addMesh(desk, new THREE.BoxGeometry(0.22, 3.8, 0.22), deskEdgeMat, [5.6, -1.15, 1.9]);
    addMesh(desk, new THREE.BoxGeometry(0.22, 3.8, 0.22), deskEdgeMat, [-5.6, -1.15, -4.5]);
    addMesh(desk, new THREE.BoxGeometry(0.22, 3.8, 0.22), deskEdgeMat, [5.6, -1.15, -4.5]);

    // Anti-static ESD Mat on Desk
    addMesh(
      desk,
      new THREE.BoxGeometry(7.5, 0.015, 3.6),
      new THREE.MeshStandardMaterial({ color: '#253531', roughness: 0.7 }),
      [0, 0.7, -0.6]
    );

    // 3. Desk Props (Laptop, Oscilloscope, Coffee, Logbook, Plant)
    const props = new THREE.Group();
    scene.add(props);

    // Laptop
    const laptop = new THREE.Group();
    laptop.position.set(-0.8, 0.88, -1.7);
    addMesh(laptop, new RoundedBoxGeometry(2.1, 0.08, 1.4, 4, 0.04), darkChassis, [0, 0, 0], [-0.06, 0, 0]);
    addMesh(laptop, new RoundedBoxGeometry(2.02, 1.25, 0.06, 4, 0.03), darkChassis, [0, 0.62, -0.62], [-0.2, 0, 0]);
    // Laptop Glowing Screen Face
    addMesh(
      laptop,
      new RoundedBoxGeometry(1.86, 1.05, 0.012, 4, 0.02),
      new THREE.MeshStandardMaterial({
        color: '#739589',
        emissive: '#44665a',
        emissiveIntensity: 0.45,
        roughness: 0.25,
      }),
      [0, 0.62, -0.65],
      [-0.2, 0, 0]
    );
    props.add(laptop);

    // Digital Storage Oscilloscope (Benchtop Instrument on Right)
    const scope = new THREE.Group();
    scope.position.set(2.6, 1.22, -2.1);
    addMesh(scope, new RoundedBoxGeometry(1.9, 1.15, 1.6, 4, 0.05), oscilloscopeMat, [0, 0, 0]);
    // Glowing Oscilloscope Display with waveform
    addMesh(
      scope,
      new THREE.PlaneGeometry(1.1, 0.72),
      new THREE.MeshStandardMaterial({
        color: '#0891b2',
        emissive: '#0891b2',
        emissiveIntensity: 0.6,
        roughness: 0.2,
      }),
      [-0.25, 0.08, 0.81]
    );
    // Rotary Dial Knobs
    for (let k = 0; k < 3; k++) {
      const knob = addMesh(
        scope,
        new THREE.CylinderGeometry(0.065, 0.065, 0.05, 16),
        brassMat,
        [0.55, 0.25 - k * 0.22, 0.82]
      );
      knob.rotation.x = Math.PI / 2;
    }
    props.add(scope);

    // Coffee Mug on Left
    const mug = new THREE.Group();
    mug.position.set(-2.8, 0.72, -0.4);
    addMesh(mug, new THREE.CylinderGeometry(0.34, 0.28, 0.52, 28), new THREE.MeshStandardMaterial({ color: '#cfb79a', roughness: 0.5 }), [0, 0, 0]);
    addMesh(mug, new THREE.CylinderGeometry(0.26, 0.26, 0.02, 28), new THREE.MeshStandardMaterial({ color: '#3b281f', roughness: 0.2 }), [0, 0.26, 0]);
    props.add(mug);

    // Lab Equipment Logbook on Right Desk
    const logbook = new THREE.Group();
    logbook.position.set(1.9, 0.68, 0.4);
    logbook.rotation.y = -0.15;
    addMesh(logbook, new RoundedBoxGeometry(1.3, 0.1, 1.65, 3, 0.04), new THREE.MeshStandardMaterial({ color: '#ba4d2b', roughness: 0.75 }), [0, 0, 0]);
    addMesh(logbook, new RoundedBoxGeometry(1.15, 0.012, 1.5, 2, 0.02), paperMat, [0, 0.06, 0]);
    props.add(logbook);

    // 4. Lighting & Ambience
    const ambientLight = new THREE.HemisphereLight('#fff5e8', '#5a463d', 2.0);
    scene.add(ambientLight);

    const keySun = new THREE.DirectionalLight('#fff2db', 3.0);
    keySun.position.set(-4, 9, 5);
    keySun.castShadow = true;
    keySun.shadow.mapSize.set(2048, 2048);
    Object.assign(keySun.shadow.camera, {
      left: -9,
      right: 9,
      top: 9,
      bottom: -7,
      near: 1,
      far: 24,
    });
    keySun.shadow.bias = -0.0008;
    keySun.shadow.normalBias = 0.02;
    scene.add(keySun);

    const warmDeskLamp = new THREE.PointLight('#e8b25f', 1.8, 7, 2);
    warmDeskLamp.position.set(1.2, 2.6, -1.8);
    scene.add(warmDeskLamp);

    // 5. Floating 3D Option Cards (Raycast Interactive)
    type FloatingCardMesh = {
      id: string;
      group: THREE.Group;
      panel: THREE.Mesh;
      accent: THREE.Mesh;
      hit: THREE.Mesh;
      base: THREE.Vector3;
      phase: number;
      href: string;
    };

    function makeTextTexture(label: string, detail: string, tone: string) {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 250;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = tone;
      ctx.font = "bold 24px 'DM Mono', monospace";
      ctx.letterSpacing = '3px';
      ctx.fillText(detail, 36, 56);

      ctx.fillStyle = '#ffffff';
      ctx.font = "bold 38px 'DM Sans', sans-serif";
      ctx.fillText(label, 36, 120);

      ctx.fillStyle = '#b8b2a5';
      ctx.font = "500 22px 'DM Mono', monospace";
      ctx.fillText('CLICK TO ENTER →', 36, 185);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      return tex;
    }

    function createFloatingCard(option: KeeperCardOption, pos: THREE.Vector3, phase: number): FloatingCardMesh {
      const grp = new THREE.Group();
      grp.position.copy(pos);

      const pnl = addMesh(
        grp,
        new RoundedBoxGeometry(1.68, 0.78, 0.08, 5, 0.075),
        new THREE.MeshStandardMaterial({
          color: '#242b27',
          roughness: 0.52,
          metalness: 0.12,
        }),
        [0, 0, 0]
      );

      const frontFace = new THREE.Mesh(
        new THREE.PlaneGeometry(1.48, 0.58),
        new THREE.MeshBasicMaterial({
          map: makeTextTexture(option.label, option.detail, option.tone),
          transparent: true,
          depthWrite: false,
        })
      );
      frontFace.position.z = 0.052;
      grp.add(frontFace);

      const acc = addMesh(
        grp,
        new THREE.BoxGeometry(0.06, 0.36, 0.02),
        new THREE.MeshStandardMaterial({
          color: option.tone,
          emissive: option.tone,
          emissiveIntensity: 0.35,
          roughness: 0.3,
        }),
        [-0.68, 0, 0.058]
      );

      const hitBox = new THREE.Mesh(
        new THREE.BoxGeometry(1.88, 0.94, 0.25),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitBox.userData.optionId = option.id;
      hitBox.userData.href = option.href;
      grp.add(hitBox);

      grp.userData.optionId = option.id;
      grp.userData.href = option.href;

      return {
        id: option.id,
        group: grp,
        panel: pnl,
        accent: acc,
        hit: hitBox,
        base: pos.clone(),
        phase,
        href: option.href,
      };
    }

    // 5 Cards arranged in an arc above the workbench
    const cardPositions = [
      new THREE.Vector3(-3.2, 2.45, -1.6),
      new THREE.Vector3(-1.6, 2.75, -2.2),
      new THREE.Vector3(0.0, 2.9, -2.5),
      new THREE.Vector3(1.6, 2.75, -2.2),
      new THREE.Vector3(3.2, 2.45, -1.6),
    ];

    const cards: FloatingCardMesh[] = KEEPER_OPTIONS.map((opt, i) =>
      createFloatingCard(opt, cardPositions[i], i * 1.2)
    );
    cards.forEach((c) => scene.add(c.group));

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hoveredId: string | null = null;
    let isRunning = true;
    let animId = 0;
    let lastTime = performance.now();

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

    function updateRay(e: PointerEvent) {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      pointer.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(
        cards.map((c) => c.hit),
        false
      )[0];
      const nextId = hit?.object.userData.optionId as string | undefined;
      if (nextId !== hoveredId) {
        hoveredId = nextId ?? null;
        element.style.cursor = hoveredId ? 'pointer' : 'default';
        setActiveCardId(hoveredId);
      }
    }

    function onPointerMove(e: PointerEvent) {
      updateRay(e);
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const offsetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const offsetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      desiredLook.copy(lookAt).add(new THREE.Vector3(offsetX * 0.38, -offsetY * 0.12, 0));
    }

    function onPointerDown(e: PointerEvent) {
      updateRay(e);
      if (hoveredId) {
        e.preventDefault();
        const clickedCard = cards.find((c) => c.id === hoveredId);
        if (clickedCard) {
          router.push(clickedCard.href);
        }
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= cards.length) {
        const target = cards[num - 1];
        if (target) {
          router.push(target.href);
        }
      }
    }

    element.addEventListener('pointermove', onPointerMove);
    element.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);

    function animate(time: number) {
      if (!isRunning) return;
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      camera.lookAt(desiredLook);

      cards.forEach((card) => {
        const isHovered = hoveredId === card.id;
        const bob = Math.sin(time * 0.0012 + card.phase) * 0.04;
        card.group.position.y = card.base.y + bob;

        const targetScale = isHovered ? 1.08 : 1.0;
        const currentScale = card.group.scale.x;
        card.group.scale.setScalar(THREE.MathUtils.damp(currentScale, targetScale, 9, dt));

        const mat = card.panel.material as THREE.MeshStandardMaterial;
        mat.emissive.set(isHovered ? '#3b322a' : '#000000');
        mat.emissiveIntensity = isHovered ? 1.4 : 0;

        const accMat = card.accent.material as THREE.MeshStandardMaterial;
        accMat.emissiveIntensity = isHovered ? 1.8 : 0.35;

        card.group.rotation.z = Math.sin(time * 0.0009 + card.phase) * 0.015;
      });

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      observer.disconnect();
      element.removeEventListener('pointermove', onPointerMove);
      element.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);

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
  }, [inventoryCount, pendingRequestsCount, activeLoansCount, unreadNotifsCount, router]);

  return (
    <div className="relative w-full h-[620px] rounded-3xl overflow-hidden border border-[#dcd7cb] bg-[#ede7dc] shadow-2xl select-none">
      {/* 3D WebGL Canvas */}
      <div ref={host} className="w-full h-full cursor-default" tabIndex={0} />

      {/* Top Telemetry Header Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 text-xs font-mono backdrop-blur-md shadow-sm pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span className="font-bold text-slate-900">{profileName}</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600">{roleDesignation}</span>
          <span className="text-slate-400">/</span>
          <span className="text-amber-800 font-bold">{instituteName}</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-[11px] font-mono text-slate-600 backdrop-blur-md">
            FPP 3D DESK &bull; KEYS 1&ndash;5
          </span>
        </div>
      </div>

      {/* Bottom Option Bar Pills */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 max-w-full overflow-x-auto px-4 py-2 z-10 pointer-events-auto">
        {KEEPER_OPTIONS.map((opt, i) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => router.push(opt.href)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition backdrop-blur-md ${
              activeCardId === opt.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                : 'bg-white/85 text-slate-700 border-slate-200 hover:bg-white hover:text-slate-950 shadow-xs'
            }`}
          >
            <span className="text-[10px] text-slate-400">{i + 1}</span>
            <span>{opt.label}</span>
            {opt.badge && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold text-[9px]">
                {opt.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
