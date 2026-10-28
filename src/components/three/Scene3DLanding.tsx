'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { TextRoll } from '@/components/core/text-roll';
import { DEMO_USERS } from '@/lib/auth/demo-users';
import { switchDemoUser } from '@/app/actions/auth';
import {
  Shield,
  Compass,
  Plug,
  ArrowRight,
  UserCheck,
  Building2,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

// Web Audio sound synthesizer for physical cable interactions
function playSound(type: 'pickup' | 'plug' | 'spark') {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'pickup') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'plug') {
      // Heavy metallic contact + relay click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);

      // Electric buzz burst
      const buzz = ctx.createOscillator();
      const buzzGain = ctx.createGain();
      buzz.type = 'sawtooth';
      buzz.frequency.setValueAtTime(60, ctx.currentTime);
      buzzGain.gain.setValueAtTime(0.15, ctx.currentTime);
      buzzGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      buzz.connect(buzzGain);
      buzzGain.connect(ctx.destination);
      buzz.start();
      buzz.stop(ctx.currentTime + 0.3);
    }
  } catch {
    // Audio context unavailable or restricted
  }
}

// Socket 3D coordinates on the wall
const KEEPER_SOCKET_POS = new THREE.Vector3(-2.6, 0.4, -0.4);
const SEEKER_SOCKET_POS = new THREE.Vector3(2.6, 0.4, -0.4);
const KEEPER_BULB_POS = new THREE.Vector3(-2.6, 2.2, -0.3);
const SEEKER_BULB_POS = new THREE.Vector3(2.6, 2.2, -0.3);
const CABLE_ANCHOR = new THREE.Vector3(0, -2.48, 2.8);

// 3D Bulb Component on the Wall
function Bulb3D({
  position,
  color,
  active,
  onClick,
  label,
}: {
  position: THREE.Vector3;
  color: string;
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  const bulbRef = useRef<THREE.Group>(null);
  const filamentRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (active && filamentRef.current) {
      // Warm glowing filament pulse
      const t = state.clock.elapsedTime * 6;
      const mat = filamentRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 4 + Math.sin(t) * 0.8;
      }
    }
  });

  return (
    <group
      ref={bulbRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      {/* Real 3D PointLight casting dynamic shadows and room illumination */}
      {active && (
        <>
          <pointLight
            color={color}
            intensity={4.8}
            distance={14}
            decay={2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          {/* Ambient downward beam projection */}
          <pointLight
            position={[0, -1, 0.5]}
            color={color}
            intensity={2.5}
            distance={6}
          />
        </>
      )}

      {/* Wall Bracket / Base Fitting */}
      <mesh position={[0, 0.85, -0.3]}>
        <boxGeometry args={[0.7, 0.7, 0.2]} />
        <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Gooseneck Pipe to Bulb Base */}
      <mesh position={[0, 0.65, -0.1]} rotation={[Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.5, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Brass / Metal Screw Socket Base */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.3, 0.34, 0.35, 32]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.9} />
      </mesh>

      {/* Internal Filament Wire (Glows when active) */}
      <mesh ref={filamentRef} position={[0, 0, 0]}>
        <torusGeometry args={[0.18, 0.025, 16, 32]} />
        <meshStandardMaterial
          color={active ? '#ffffff' : color}
          emissive={active ? color : '#000000'}
          emissiveIntensity={active ? 5 : 0}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Outer Glass Envelope */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.62, 36, 36]} />
        <meshPhysicalMaterial
          color={active ? color : '#E2E8F0'}
          emissive={active ? color : '#000000'}
          emissiveIntensity={active ? 2.2 : 0}
          roughness={0.06}
          transmission={0.88}
          thickness={0.5}
          transparent
          opacity={active ? 0.95 : 0.6}
        />
      </mesh>
    </group>
  );
}

// 3D Wall Socket Receptacle Component
function Socket3D({
  position,
  color,
  active,
  isTarget,
  onClick,
  title,
  subtitle,
}: {
  position: THREE.Vector3;
  color: string;
  active: boolean;
  isTarget: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <group position={position} onClick={onClick}>
      {/* Faceplate on the Wall */}
      <mesh position={[0, 0, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.5, 0.16]} />
        <meshStandardMaterial
          color={active ? '#334155' : '#1E293B'}
          roughness={0.35}
          metalness={0.8}
        />
      </mesh>

      {/* Beveled Metallic Outer Bezel */}
      <mesh position={[0, 0, 0.06]}>
        <cylinderGeometry args={[0.62, 0.65, 0.08, 36]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.95}
          emissive={active ? color : '#000000'}
          emissiveIntensity={active ? 1.2 : 0.1}
        />
      </mesh>

      {/* Socket Inner Cavity Hole (Where the plug enters) */}
      <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.2, 32]} />
        <meshStandardMaterial
          color="#080b0f"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Internal Metallic Contact Ring */}
      <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.24, 0.03, 16, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={active ? color : '#000000'}
          emissiveIntensity={active ? 2.5 : 0.2}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>

      {/* Pulsing Target Indicator when dragging cable near */}
      {isTarget && (
        <mesh position={[0, 0, 0.15]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.7, 0.85, 32]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}

// 3D Movable Cable and Jack Plug Component
function CableAndPlug3D({
  plugPos,
  isDragging,
  connectedSocket,
  onPointerDown,
  onPointerUp,
  onPointerMove,
}: {
  plugPos: THREE.Vector3;
  isDragging: boolean;
  connectedSocket: 'keeper' | 'seeker' | null;
  onPointerDown: (e: any) => void;
  onPointerUp: () => void;
  onPointerMove: (point: THREE.Vector3) => void;
}) {
  const tubeMeshRef = useRef<THREE.Mesh>(null);
  const plugGroupRef = useRef<THREE.Group>(null);

  // Compute 3D Catmull-Rom spline curve from floor anchor to plug
  const curve = useMemo(() => {
    const p0 = CABLE_ANCHOR.clone();
    const pEnd = plugPos.clone();

    // Natural floor bend point
    const p1 = new THREE.Vector3(
      p0.x * 0.7 + pEnd.x * 0.3,
      -2.46, // Slumped on the floor
      p0.z * 0.7 + pEnd.z * 0.3
    );

    // Mid air sag point based on drag height
    const midY = isDragging
      ? Math.max(-2.4, pEnd.y * 0.4 - 1.2)
      : connectedSocket
      ? -1.2
      : -2.42;

    const p2 = new THREE.Vector3(
      p0.x * 0.3 + pEnd.x * 0.7,
      midY,
      p0.z * 0.3 + pEnd.z * 0.7
    );

    // Lead-in to the plug neck
    const p3 = new THREE.Vector3(
      pEnd.x,
      pEnd.y - (connectedSocket ? 0.3 : 0.15),
      pEnd.z + 0.15
    );

    return new THREE.CatmullRomCurve3([p0, p1, p2, p3, pEnd], false, 'centripetal', 0.5);
  }, [plugPos, isDragging, connectedSocket]);

  // Update dynamic tube geometry every frame
  useFrame(() => {
    if (!tubeMeshRef.current) return;
    const geom = new THREE.TubeGeometry(curve, 44, 0.075, 12, false);
    tubeMeshRef.current.geometry.dispose();
    tubeMeshRef.current.geometry = geom;

    // Align plug group rotation
    if (plugGroupRef.current) {
      if (connectedSocket) {
        // Plug inserted into wall: points straight into socket
        plugGroupRef.current.rotation.set(Math.PI / 2, 0, 0);
      } else if (isDragging) {
        // Tilted upward in hand
        plugGroupRef.current.rotation.set(Math.PI / 3, 0, 0);
      } else {
        // Lying on the floor
        plugGroupRef.current.rotation.set(0, 0, Math.PI / 6);
      }
    }
  });

  const cableColor =
    connectedSocket === 'keeper'
      ? '#C49A55'
      : connectedSocket === 'seeker'
      ? '#67C7D4'
      : '#263447';

  return (
    <group>
      {/* 3D Tube Cable Mesh */}
      <mesh ref={tubeMeshRef} castShadow receiveShadow>
        <tubeGeometry args={[curve, 44, 0.075, 12, false]} />
        <meshStandardMaterial
          color="#334155"
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* 3D Plug Assembly (The Grabbable Object) */}
      <group
        ref={plugGroupRef}
        position={plugPos}
        onPointerDown={onPointerDown}
      >
        {/* Metal Contact Tip Pin */}
        <mesh position={[0, 0.28, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.35, 24]} />
          <meshStandardMaterial
            color={cableColor}
            metalness={0.98}
            roughness={0.1}
            emissive={connectedSocket ? cableColor : '#000000'}
            emissiveIntensity={connectedSocket ? 2.5 : 0}
          />
        </mesh>

        {/* Insulating Separator Ring */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.05, 24]} />
          <meshStandardMaterial color="#0b0e14" roughness={0.9} />
        </mesh>

        {/* Jack Sleeve Ring */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.1, 24]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.95} roughness={0.2} />
        </mesh>

        {/* Ergonomic Rubber Handle Barrel (Grip) */}
        <mesh position={[0, -0.32, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.16, 0.58, 24]} />
          <meshStandardMaterial
            color="#1E293B"
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>

        {/* Colored Accent Grip Band */}
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.185, 0.185, 0.15, 24]} />
          <meshStandardMaterial
            color={cableColor}
            roughness={0.3}
            metalness={0.8}
            emissive={cableColor}
            emissiveIntensity={connectedSocket ? 1.2 : 0.2}
          />
        </mesh>

        {/* Flexible Strain Relief Boot */}
        <mesh position={[0, -0.7, 0]}>
          <coneGeometry args={[0.14, 0.25, 24]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

// Main 3D Scene Container
function Scene({
  onConnect,
  statusText,
  setStatusText,
}: {
  onConnect: (portal: 'keeper' | 'seeker') => void;
  statusText: string;
  setStatusText: (t: string) => void;
}) {
  const { viewport } = useThree();

  const [plugPos, setPlugPos] = useState<THREE.Vector3>(
    new THREE.Vector3(0.4, -2.36, 1.3) // Initially resting on the floor
  );
  const [isDragging, setIsDragging] = useState(false);
  const [connectedSocket, setConnectedSocket] = useState<'keeper' | 'seeker' | null>(null);

  // Invisible drag plane parallel to camera to capture cursor motion in 3D
  const dragPlaneRef = useRef<THREE.Mesh>(null);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    setConnectedSocket(null);
    playSound('pickup');
    setStatusText('Drag the cable and insert it into a wall socket');
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Check distance to Keeper socket
    const distKeeper = plugPos.distanceTo(KEEPER_SOCKET_POS);
    // Check distance to Seeker socket
    const distSeeker = plugPos.distanceTo(SEEKER_SOCKET_POS);

    if (distKeeper < 1.35) {
      setPlugPos(KEEPER_SOCKET_POS.clone().add(new THREE.Vector3(0, 0, 0.1)));
      setConnectedSocket('keeper');
      playSound('plug');
      setStatusText('⚡ Circuit Complete! Connecting to Keeper Portal...');
      onConnect('keeper');
    } else if (distSeeker < 1.35) {
      setPlugPos(SEEKER_SOCKET_POS.clone().add(new THREE.Vector3(0, 0, 0.1)));
      setConnectedSocket('seeker');
      playSound('plug');
      setStatusText('⚡ Circuit Complete! Connecting to Seeker Portal...');
      onConnect('seeker');
    } else {
      // Return plug gently to floor
      setPlugPos(new THREE.Vector3(plugPos.x * 0.7, -2.36, 1.3));
      setStatusText('Cable dropped on the floor — pick up to connect');
    }
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging) return;
    e.stopPropagation();
    const point = e.point as THREE.Vector3;
    if (!point) return;

    // Constrain within 3D room coordinates
    const clampedX = Math.max(-4.2, Math.min(4.2, point.x));
    const clampedY = Math.max(-2.35, Math.min(2.8, point.y));
    const clampedZ = Math.max(-0.2, Math.min(2.5, point.z));

    const newPos = new THREE.Vector3(clampedX, clampedY, clampedZ);
    setPlugPos(newPos);

    const distKeeper = newPos.distanceTo(KEEPER_SOCKET_POS);
    const distSeeker = newPos.distanceTo(SEEKER_SOCKET_POS);

    if (distKeeper < 1.35) {
      setStatusText('Release to snap into Keeper Socket');
    } else if (distSeeker < 1.35) {
      setStatusText('Release to snap into Seeker Socket');
    } else {
      setStatusText('Dragging cable in 3D...');
    }
  };

  // Direct click connection trigger
  const handleDirectClick = (target: 'keeper' | 'seeker') => {
    playSound('pickup');
    const dest =
      target === 'keeper'
        ? KEEPER_SOCKET_POS.clone().add(new THREE.Vector3(0, 0, 0.1))
        : SEEKER_SOCKET_POS.clone().add(new THREE.Vector3(0, 0, 0.1));

    setPlugPos(dest);
    setConnectedSocket(target);
    playSound('plug');
    setStatusText(
      target === 'keeper'
        ? '⚡ Circuit Complete! Connecting to Keeper Portal...'
        : '⚡ Circuit Complete! Connecting to Seeker Portal...'
    );
    onConnect(target);
  };

  return (
    <>
      {/* Invisible Full-Screen Raycast Dragging Plane */}
      <mesh
        ref={dragPlaneRef}
        position={[0, 0, 0.6]}
        visible={false}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <planeGeometry args={[26, 26]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* 3D Atmospheric Lighting */}
      <ambientLight intensity={0.85} />
      <directionalLight
        position={[2, 9, 6]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[-4, 5, 4]}
        intensity={0.5}
      />

      {/* 3D Laboratory Back Wall (Receives shadows and light) */}
      <mesh position={[0, 1.2, -0.6]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial
          color="#EDF2F7"
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>

      {/* 3D Laboratory Floor / Ground (Where cable lies) */}
      <mesh position={[0, -2.5, 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial
          color="#CBD5E1"
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* Cable Ground Terminal Junction Box */}
      <mesh position={[CABLE_ANCHOR.x, -2.4, CABLE_ANCHOR.z]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.2, 0.6]} />
        <meshStandardMaterial color="#94A3B8" roughness={0.25} metalness={0.8} />
      </mesh>

      {/* 3D Bulbs */}
      <Bulb3D
        position={KEEPER_BULB_POS}
        color="#C49A55"
        active={connectedSocket === 'keeper'}
        onClick={() => handleDirectClick('keeper')}
        label="Keeper"
      />
      <Bulb3D
        position={SEEKER_BULB_POS}
        color="#67C7D4"
        active={connectedSocket === 'seeker'}
        onClick={() => handleDirectClick('seeker')}
        label="Seeker"
      />

      {/* 3D Wall Sockets */}
      <Socket3D
        position={KEEPER_SOCKET_POS}
        color="#C49A55"
        active={connectedSocket === 'keeper'}
        isTarget={isDragging && plugPos.distanceTo(KEEPER_SOCKET_POS) < 1.35}
        onClick={() => handleDirectClick('keeper')}
        title="KEEPER PORTAL"
        subtitle="For Lab Heads & Custodians"
      />
      <Socket3D
        position={SEEKER_SOCKET_POS}
        color="#67C7D4"
        active={connectedSocket === 'seeker'}
        isTarget={isDragging && plugPos.distanceTo(SEEKER_SOCKET_POS) < 1.35}
        onClick={() => handleDirectClick('seeker')}
        title="SEEKER PORTAL"
        subtitle="For Students & Makers"
      />

      {/* 3D Movable Cable and Jack Plug */}
      <CableAndPlug3D
        plugPos={plugPos}
        isDragging={isDragging}
        connectedSocket={connectedSocket}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
      />
    </>
  );
}

// Full-Page Three.js 3D Landing Page
export function Scene3DLanding() {
  const router = useRouter();
  const [statusText, setStatusText] = useState('Pick up the 3D cable from the ground and plug it into a wall socket');
  const [showDemoTray, setShowDemoTray] = useState(false);
  const [loadingDemoId, setLoadingDemoId] = useState<string | null>(null);

  const handleConnect = useCallback(
    (portal: 'keeper' | 'seeker') => {
      setTimeout(() => {
        router.push(portal === 'keeper' ? '/sender' : '/receiver');
      }, 1200);
    },
    [router]
  );

  const handleDemoLogin = async (userId: string, targetPath: string) => {
    setLoadingDemoId(userId);
    try {
      await switchDemoUser(userId, targetPath);
    } catch {
      router.push(targetPath);
    }
  };

  const keepers = DEMO_USERS.filter((u) => u.platformType === 'sender');
  const seekers = DEMO_USERS.filter((u) => u.platformType === 'receiver');

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] min-h-[640px] overflow-hidden flex flex-col items-center justify-between select-none">
      {/* ===================================================================== */}
      {/* OVERLAY HEADER: TITLE & INTERACTIVE STATUS */}
      {/* ===================================================================== */}
      <div className="relative z-20 pt-6 px-4 text-center max-w-2xl mx-auto space-y-2 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-slate-200 text-slate-800 text-xs font-semibold shadow-sm backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#C49A55] animate-pulse" />
          <span className="tracking-wider uppercase text-[11px] font-mono text-[#A17A38]">
            3D Electronics Exchange Chamber
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#0891B2]" />
        </div>

        <div className="flex items-center justify-center font-serif text-5xl sm:text-7xl font-bold tracking-tight">
          <TextRoll className="text-[#C49A55]">IO</TextRoll>
          <TextRoll className="text-[#0F172A]">Together</TextRoll>
        </div>

        <p className="font-serif text-base text-slate-700 font-medium">
          Share Resources. Build Possibilities.
        </p>

        {/* Live Interactive Status Pill */}
        <div className="pt-1 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-slate-300 text-xs text-slate-800 font-mono shadow-md backdrop-blur-md pointer-events-auto">
            <Plug className="w-3.5 h-3.5 text-[#C49A55] animate-bounce" />
            <span>{statusText}</span>
          </span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* FULL-PAGE THREE.JS CANVAS */}
      {/* ===================================================================== */}
      <div className="absolute inset-0 w-full h-full z-10 cursor-grab active:cursor-grabbing">
        <Canvas
          shadows
          camera={{ position: [0, 0.4, 6.2], fov: 48 }}
          dpr={[1, 2]}
        >
          <Scene
            onConnect={handleConnect}
            statusText={statusText}
            setStatusText={setStatusText}
          />
        </Canvas>
      </div>

      {/* ===================================================================== */}
      {/* OVERLAY FOOTER: 3D LABELS, QUICK BUTTONS & DEMO PROFILES */}
      {/* ===================================================================== */}
      <div className="relative z-20 pb-4 px-4 w-full max-w-3xl flex flex-col items-center gap-3">
        {/* Terminal Quick Access Cards */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {/* Left Keeper Station Label */}
          <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-amber-300 text-center shadow-md">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-800 font-bold block">
              WALL SOCKET 01
            </span>
            <span className="font-serif text-sm font-bold text-slate-900 block">
              Keeper Portal
            </span>
            <span className="text-[10px] text-slate-500 block">
              Lab Heads &amp; Equipment Custodians
            </span>
          </div>

          {/* Right Seeker Station Label */}
          <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-cyan-300 text-center shadow-md">
            <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-800 font-bold block">
              WALL SOCKET 02
            </span>
            <span className="font-serif text-sm font-bold text-slate-900 block">
              Seeker Portal
            </span>
            <span className="text-[10px] text-slate-500 block">
              Students, Teachers &amp; Innovators
            </span>
          </div>
        </div>

        {/* Instant Demo Profiles Toggle */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowDemoTray(!showDemoTray)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-700 hover:text-amber-800 transition font-mono bg-white/90 hover:bg-white px-3 py-1 rounded-full border border-slate-300 backdrop-blur-md shadow-xs"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#C49A55]" />
            <span>{showDemoTray ? 'Hide Demo Profiles' : 'One-Click Demo Profiles (2 Colleges • 1 School)'}</span>
          </button>
        </div>

        {showDemoTray && (
          <div className="p-4 rounded-2xl bg-white/98 border border-slate-200 shadow-2xl text-left space-y-3 w-full backdrop-blur-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-mono text-amber-800 font-bold uppercase block mb-1">
                  Keepers (Lab Heads)
                </span>
                <div className="space-y-1">
                  {keepers.map((u, i) => (
                    <button
                      key={u.id}
                      onClick={() => handleDemoLogin(u.id, '/sender')}
                      disabled={loadingDemoId !== null}
                      className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50/80 border border-slate-200 hover:border-amber-400 text-xs flex items-center justify-between group transition"
                    >
                      <div className="truncate">
                        <span className="font-bold text-slate-900 group-hover:text-amber-800">{u.name}</span>
                        <span className="text-[9px] text-slate-500 block truncate">{u.instituteName}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-800 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-cyan-800 font-bold uppercase block mb-1">
                  Seekers (Students &amp; Mentors)
                </span>
                <div className="space-y-1">
                  {seekers.map((u, i) => (
                    <button
                      key={u.id}
                      onClick={() => handleDemoLogin(u.id, '/receiver')}
                      disabled={loadingDemoId !== null}
                      className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-cyan-50/80 border border-slate-200 hover:border-cyan-400 text-xs flex items-center justify-between group transition"
                    >
                      <div className="truncate">
                        <span className="font-bold text-slate-900 group-hover:text-cyan-800">{u.name}</span>
                        <span className="text-[9px] text-slate-500 block truncate">{u.instituteName}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-800 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
