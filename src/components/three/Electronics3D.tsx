'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Interactive Rotating Microcontroller / IoT Chip
export function FloatingMicrocontroller({
  scale = 1,
  hoverGlow = true,
}: {
  scale?: number;
  hoverGlow?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Gentle floating rotation
    groupRef.current.rotation.y += delta * 0.6;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
  });

  return (
    <group
      ref={groupRef}
      scale={scale * (hovered ? 1.08 : 1)}
      onPointerOver={() => hoverGlow && setHovered(true)}
      onPointerOut={() => hoverGlow && setHovered(false)}
    >
      {/* Main PCB substrate (Deep nocturnal navy #141821 / #263447) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.12, 1.4]} />
        <meshStandardMaterial
          color={hovered ? '#1c2836' : '#141821'}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Central IC Microprocessor Core (Glossy Charcoal with Brass Logo) */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.9, 0.08, 0.9]} />
        <meshStandardMaterial
          color="#0b0e14"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Gold Connectors & Pins (Primary #C49A55) */}
      {[-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9].map((x, i) => (
        <React.Fragment key={i}>
          {/* Top pin row */}
          <mesh position={[x, 0.02, 0.65]}>
            <boxGeometry args={[0.08, 0.06, 0.15]} />
            <meshStandardMaterial
              color="#C49A55"
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>
          {/* Bottom pin row */}
          <mesh position={[x, 0.02, -0.65]}>
            <boxGeometry args={[0.08, 0.06, 0.15]} />
            <meshStandardMaterial
              color="#C49A55"
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>
        </React.Fragment>
      ))}

      {/* Wi-Fi / RF Shield Antenna (Brass Plate) */}
      <mesh position={[-0.75, 0.09, 0]}>
        <boxGeometry args={[0.5, 0.06, 0.7]} />
        <meshStandardMaterial
          color="#C49A55"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Pulsing Status LED Indicator (Accent #67C7D4) */}
      <mesh position={[0.85, 0.09, 0.45]}>
        <cylinderGeometry args={[0.06, 0.06, 0.08, 16]} />
        <meshStandardMaterial
          color="#67C7D4"
          emissive="#67C7D4"
          emissiveIntensity={hovered ? 2.5 : 1.2}
        />
      </mesh>
    </group>
  );
}

// 3D Holographic IoT Circuit Node Sphere
export function GlowingCircuitNode({
  color = '#67C7D4',
  secondaryColor = '#C49A55',
}: {
  color?: string;
  secondaryColor?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.8;
      meshRef.current.rotation.z += delta * 0.4;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 1.2;
      ringRef.current.rotation.y -= delta * 0.5;
    }
  });

  return (
    <group>
      {/* Outer Wireframe Icosahedron */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color={color}
          wireframe
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Orbiting Tech Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.6, 0.04, 16, 100]} />
        <meshStandardMaterial
          color={secondaryColor}
          emissive={secondaryColor}
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}
