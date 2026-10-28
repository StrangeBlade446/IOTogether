'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

export interface ThreeCanvasProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  cameraPosition?: [number, number, number];
  fov?: number;
}

export function ThreeCanvas({
  children,
  className = 'w-full h-full min-h-[300px]',
  style,
  cameraPosition = [0, 0, 5],
  fov = 50,
}: ThreeCanvasProps) {
  // Prevent SSR WebGL execution in Next.js App Router
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className} style={style} />;
  }

  return (
    <div className={className} style={style}>
      <Canvas camera={{ position: cameraPosition, fov }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#F1E7D0" />
        <pointLight position={[-10, -5, -10]} intensity={0.8} color="#67C7D4" />
        <pointLight position={[0, -10, 5]} intensity={0.6} color="#C49A55" />
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}

// User-provided base template App component
export const App = ({ children }: { children?: React.ReactNode }) => (
  <ThreeCanvas>
    <pointLight position={[10, 10, 10]} />
    {children}
  </ThreeCanvas>
);
