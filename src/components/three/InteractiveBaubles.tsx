'use client';

import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, useSphere } from '@react-three/cannon';
import * as THREE from 'three';

// 5-Color Guild Palette
const GUILD_COLORS = [
  '#C49A55', // Primary Brass / Gold
  '#67C7D4', // Accent Cyan
  '#263447', // Secondary Nocturnal Navy
  '#F1E7D0', // Text Parchment
  '#e5bc7b', // Light Forge Gold
  '#3d8b96', // Deep Cyan Glow
  '#1c2836', // Charcoal Blue
];

interface BaubleData {
  id: number;
  scale: number;
  color: string;
  metalness: number;
  roughness: number;
  initialPos: [number, number, number];
}

// Single colliding bauble
function Bauble({
  scale,
  color,
  metalness,
  roughness,
  initialPos,
}: {
  scale: number;
  color: string;
  metalness: number;
  roughness: number;
  initialPos: [number, number, number];
}) {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    args: [0.75 * scale],
    linearDamping: 0.75,
    angularDamping: 0.45,
    position: initialPos,
  }));

  const pos = useRef<[number, number, number]>(initialPos);

  useEffect(() => {
    const unsub = api.position.subscribe((p) => {
      pos.current = p as [number, number, number];
    });
    return unsub;
  }, [api]);

  useFrame(() => {
    // Centripetal force pulling toward origin [0, 0, 0]
    api.applyForce(
      [
        -pos.current[0] * 3.8,
        -pos.current[1] * 3.8,
        -pos.current[2] * 3.8,
      ],
      [0, 0, 0]
    );
  });

  return (
    <mesh ref={ref as any} castShadow receiveShadow>
      <sphereGeometry args={[0.75 * scale, 32, 32]} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        emissive={color}
        emissiveIntensity={0.08}
      />
    </mesh>
  );
}

// Invisible Kinematic pointer that follows cursor and collides with baubles
function Pointer() {
  const { viewport, mouse } = useThree();
  const [ref, api] = useSphere(() => ({
    type: 'Kinematic',
    args: [1.7],
    position: [0, 0, 0],
  }));

  useFrame(() => {
    api.position.set(
      (mouse.x * viewport.width) / 2,
      (mouse.y * viewport.height) / 2,
      0
    );
  });

  return (
    <mesh ref={ref as any}>
      <sphereGeometry args={[1.7, 16, 16]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
}

export function InteractiveBaubles({
  count = 28,
  className = 'w-full h-full min-h-[350px]',
  interactive = true,
}: {
  count?: number;
  className?: string;
  interactive?: boolean;
}) {
  // Prevent SSR WebGL issues
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const baubles: BaubleData[] = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      scale: 0.65 + Math.random() * 0.7,
      color: GUILD_COLORS[i % GUILD_COLORS.length],
      metalness: 0.75 + Math.random() * 0.25,
      roughness: 0.1 + Math.random() * 0.25,
      initialPos: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4,
      ] as [number, number, number],
    }));
  }, [count]);

  if (!mounted) {
    return <div className={className} />;
  }

  return (
    <div className={className}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 11], fov: 45 }}
        style={{ pointerEvents: interactive ? 'auto' : 'none' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, -10, -5]} intensity={1.2} color="#67C7D4" />
        <pointLight position={[10, -5, 5]} intensity={1.5} color="#C49A55" />

        <Physics gravity={[0, 0, 0]} defaultContactMaterial={{ restitution: 0.65 }}>
          {interactive && <Pointer />}
          {baubles.map((b) => (
            <Bauble
              key={b.id}
              scale={b.scale}
              color={b.color}
              metalness={b.metalness}
              roughness={b.roughness}
              initialPos={b.initialPos}
            />
          ))}
        </Physics>
      </Canvas>
    </div>
  );
}
