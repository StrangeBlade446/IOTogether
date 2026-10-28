'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { TextRoll } from '@/components/core/text-roll';
import { DEMO_USERS } from '@/lib/auth/demo-users';
import { switchDemoUser } from '@/app/actions/auth';
import {
  Shield,
  Compass,
  Zap,
  ArrowRight,
  UserCheck,
  Building2,
  GraduationCap,
  Sparkles,
  Plug,
} from 'lucide-react';

interface Point {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
}

// Sound effects using Web Audio API
function playSound(type: 'pickup' | 'plug' | 'hum') {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'pickup') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'plug') {
      // Satisfying heavy relay click + electric hum
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);

      // Brief high spark pop
      const spark = ctx.createOscillator();
      const sparkGain = ctx.createGain();
      spark.type = 'sawtooth';
      spark.frequency.setValueAtTime(880, ctx.currentTime);
      spark.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.06);
      sparkGain.gain.setValueAtTime(0.12, ctx.currentTime);
      sparkGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      spark.connect(sparkGain);
      sparkGain.connect(ctx.destination);
      spark.start();
      spark.stop(ctx.currentTime + 0.06);
    }
  } catch {
    // AudioContext blocked or unsupported, fail gracefully
  }
}

export function InteractiveCableSockets() {
  const router = useRouter();

  // Bench and interaction states
  const benchRef = useRef<HTMLDivElement>(null);
  const [benchDimensions, setBenchDimensions] = useState({ width: 700, height: 460 });

  const [isDragging, setIsDragging] = useState(false);
  const [plugPos, setPlugPos] = useState({ x: 350, y: 360 });
  const [connectedSocket, setConnectedSocket] = useState<'keeper' | 'seeker' | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Pick up the cable and plug into a socket');
  const [showDemoTray, setShowDemoTray] = useState(false);
  const [loadingDemoId, setLoadingDemoId] = useState<string | null>(null);

  // Socket locations relative to bench
  const socketKeeper = {
    x: benchDimensions.width * 0.28,
    y: 220,
    bulbY: 90,
  };

  const socketSeeker = {
    x: benchDimensions.width * 0.72,
    y: 220,
    bulbY: 90,
  };

  const cableOrigin = {
    x: benchDimensions.width * 0.5,
    y: benchDimensions.height - 15,
  };

  // Update bench dimensions on resize
  useEffect(() => {
    const updateSize = () => {
      if (!benchRef.current) return;
      const rect = benchRef.current.getBoundingClientRect();
      setBenchDimensions({
        width: rect.width || 700,
        height: rect.height || 460,
      });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Set initial cable resting position once dimensions are ready
  useEffect(() => {
    if (!isDragging && !connectedSocket) {
      setPlugPos({
        x: benchDimensions.width * 0.5,
        y: benchDimensions.height - 85,
      });
    }
  }, [benchDimensions, isDragging, connectedSocket]);

  // Verlet Rope Simulation points
  const NUM_POINTS = 9;
  const pointsRef = useRef<Point[]>([]);

  useEffect(() => {
    // Initialize rope chain
    const pts: Point[] = [];
    const sx = cableOrigin.x;
    const sy = cableOrigin.y;
    const ex = plugPos.x;
    const ey = plugPos.y;

    for (let i = 0; i < NUM_POINTS; i++) {
      const t = i / (NUM_POINTS - 1);
      const px = sx + (ex - sx) * t;
      const py = sy + (ey - sy) * t + Math.sin(t * Math.PI) * 40;
      pts.push({ x: px, y: py, oldX: px, oldY: py });
    }
    pointsRef.current = pts;
  }, [benchDimensions]);

  // Handle Drag Move
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging || !benchRef.current) return;
      const rect = benchRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      // Constrain within bench bounds with padding
      x = Math.max(25, Math.min(benchDimensions.width - 25, x));
      y = Math.max(40, Math.min(benchDimensions.height - 15, y));

      setPlugPos({ x, y });

      // Check proximity for visual guide
      const distKeeper = Math.hypot(x - socketKeeper.x, y - socketKeeper.y);
      const distSeeker = Math.hypot(x - socketSeeker.x, y - socketSeeker.y);

      if (distKeeper < 55) {
        setStatusMessage('Release to connect Keeper Portal');
      } else if (distSeeker < 55) {
        setStatusMessage('Release to connect Seeker Portal');
      } else {
        setStatusMessage('Dragging cable — move to a socket');
      }
    },
    [isDragging, benchDimensions, socketKeeper.x, socketKeeper.y, socketSeeker.x, socketSeeker.y]
  );

  // Handle Drag Release & Socket Snapping
  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const distKeeper = Math.hypot(plugPos.x - socketKeeper.x, plugPos.y - socketKeeper.y);
    const distSeeker = Math.hypot(plugPos.x - socketSeeker.x, plugPos.y - socketSeeker.y);

    if (distKeeper < 65) {
      // Connect to Keeper
      setPlugPos({ x: socketKeeper.x, y: socketKeeper.y });
      setConnectedSocket('keeper');
      playSound('plug');
      setStatusMessage('⚡ Circuit Complete! Keeper Portal Connected.');
      setTimeout(() => {
        router.push('/sender');
      }, 1100);
    } else if (distSeeker < 65) {
      // Connect to Seeker
      setPlugPos({ x: socketSeeker.x, y: socketSeeker.y });
      setConnectedSocket('seeker');
      playSound('plug');
      setStatusMessage('⚡ Circuit Complete! Seeker Portal Connected.');
      setTimeout(() => {
        router.push('/receiver');
      }, 1100);
    } else {
      // Drop cable on table with gentle slack
      setStatusMessage('Pick up the cable and plug into a socket');
    }
  }, [isDragging, plugPos, socketKeeper, socketSeeker, router]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Click-to-connect shortcut for touchscreens or fast access
  const handleDirectConnect = (target: 'keeper' | 'seeker') => {
    const targetSocket = target === 'keeper' ? socketKeeper : socketSeeker;
    playSound('pickup');
    setPlugPos({ x: targetSocket.x, y: targetSocket.y });
    setConnectedSocket(target);
    playSound('plug');
    setStatusMessage(
      target === 'keeper'
        ? '⚡ Circuit Complete! Connecting to Keeper Portal...'
        : '⚡ Circuit Complete! Connecting to Seeker Portal...'
    );
    setTimeout(() => {
      router.push(target === 'keeper' ? '/sender' : '/receiver');
    }, 1100);
  };

  // Instant Demo profile login
  const handleDemoLogin = async (userId: string, targetPath: string) => {
    setLoadingDemoId(userId);
    try {
      await switchDemoUser(userId, targetPath);
    } catch {
      router.push(targetPath);
    }
  };

  // Generate SVG path for natural sagging cable
  const cablePath = (() => {
    const sx = cableOrigin.x;
    const sy = cableOrigin.y;
    const ex = plugPos.x;
    const ey = plugPos.y;

    const dx = ex - sx;
    const dy = ey - sy;
    const distance = Math.hypot(dx, dy);

    // Natural gravity sag based on distance
    const sag = isDragging
      ? Math.max(30, 90 - distance * 0.15)
      : connectedSocket
      ? 120
      : 60;

    const cx1 = sx + dx * 0.25;
    const cy1 = sy + dy * 0.25 + sag;
    const cx2 = sx + dx * 0.75;
    const cy2 = ey + (isDragging ? 20 : 60);

    return `M ${sx} ${sy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${ex} ${ey}`;
  })();

  const keepers = DEMO_USERS.filter((u) => u.platformType === 'sender');
  const seekers = DEMO_USERS.filter((u) => u.platformType === 'receiver');

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]">
      {/* Top Guild Seal */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#263447]/90 border border-[#C49A55]/40 text-[#F1E7D0] text-xs font-semibold mb-5 shadow-sm backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-[#C49A55] animate-pulse" />
        <span className="tracking-wider uppercase text-[11px] font-mono text-[#C49A55]">
          Physical Electronics Exchange Protocol
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#67C7D4]" />
      </div>

      {/* Main Title: IOTogether with TextRoll */}
      <div className="text-center max-w-2xl mx-auto mb-4 space-y-2">
        <div className="flex items-center justify-center font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight">
          <TextRoll className="text-[#C49A55]">IO</TextRoll>
          <TextRoll className="text-[#F1E7D0]">Together</TextRoll>
        </div>

        <p className="font-serif text-base sm:text-lg text-[#F1E7D0]/90 font-medium">
          Share Resources. Build Possibilities.
        </p>

        {/* Live Instruction Pill */}
        <div className="pt-1 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141821]/90 border border-[#263447] text-xs text-[#F1E7D0]/80 font-mono shadow-md backdrop-blur-md">
            <Plug className="w-3.5 h-3.5 text-[#C49A55] animate-bounce" />
            <span>{statusMessage}</span>
          </span>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* THE INTERACTIVE LABORATORY BENCH: 2 BULBS, 2 SOCKETS & MOVABLE CABLE */}
      {/* ======================================================================= */}
      <div
        ref={benchRef}
        className="relative w-full max-w-3xl h-[420px] sm:h-[480px] rounded-3xl bg-[#141821]/85 backdrop-blur-2xl border-2 border-[#263447] shadow-[0_16px_60px_rgba(0,0,0,0.85)] overflow-hidden select-none touch-none blueprint-grid"
      >
        {/* Bench Ambient Circuit Tracks */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path
              d={`M ${socketKeeper.x} ${socketKeeper.y} L ${socketKeeper.x} ${socketKeeper.y + 110} L ${cableOrigin.x} ${cableOrigin.y}`}
              stroke="#C49A55"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4 4"
            />
            <path
              d={`M ${socketSeeker.x} ${socketSeeker.y} L ${socketSeeker.x} ${socketSeeker.y + 110} L ${cableOrigin.x} ${cableOrigin.y}`}
              stroke="#67C7D4"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4 4"
            />
          </svg>
        </div>

        {/* ===================================================================== */}
        {/* LEFT STATION: KEEPER (BULB 1 & SOCKET 1) */}
        {/* ===================================================================== */}
        <div
          className="absolute flex flex-col items-center"
          style={{
            left: `${socketKeeper.x}px`,
            top: `${socketKeeper.bulbY}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {/* Bulb 1: Incandescent Edison Lamp (Keeper) */}
          <button
            type="button"
            onClick={() => handleDirectConnect('keeper')}
            className="group relative cursor-pointer focus:outline-none"
            title="Click to plug in Keeper Portal"
          >
            {/* Radial Light Halo when active */}
            <div
              className={`absolute -inset-8 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
                connectedSocket === 'keeper'
                  ? 'bg-[#C49A55] opacity-80 scale-125'
                  : 'bg-[#C49A55]/10 opacity-20 group-hover:opacity-40'
              }`}
            />

            {/* Downward light beam projection */}
            {connectedSocket === 'keeper' && (
              <div
                className="absolute top-16 left-1/2 -translate-x-1/2 w-48 h-56 bg-gradient-to-b from-[#C49A55]/40 via-[#C49A55]/15 to-transparent blur-md pointer-events-none"
                style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)' }}
              />
            )}

            {/* Realistic Light Bulb SVG */}
            <svg width="68" height="92" viewBox="0 0 68 92" className="relative z-10 transition-transform duration-300 group-hover:scale-105">
              {/* Glass Envelope */}
              <path
                d="M 34 8 C 18 8 10 20 10 36 C 10 48 18 56 22 66 L 46 66 C 50 56 58 48 58 36 C 58 20 50 8 34 8 Z"
                fill={connectedSocket === 'keeper' ? '#ffeac2' : '#1a2230'}
                stroke={connectedSocket === 'keeper' ? '#C49A55' : '#263447'}
                strokeWidth="2.5"
                className="transition-colors duration-500"
              />
              {/* Filament */}
              <path
                d="M 28 66 L 28 44 L 32 36 L 36 36 L 40 44 L 40 66"
                stroke={connectedSocket === 'keeper' ? '#ffffff' : '#6b542e'}
                strokeWidth={connectedSocket === 'keeper' ? '3' : '1.5'}
                fill="none"
                strokeLinecap="round"
                className="transition-colors duration-300"
              />
              {/* Internal Filament Glow */}
              {connectedSocket === 'keeper' && (
                <circle cx="34" cy="38" r="8" fill="#ffd47d" className="animate-pulse" />
              )}
              {/* Metal Screw Base */}
              <rect x="22" y="66" width="24" height="6" rx="2" fill="#8c6b30" stroke="#C49A55" strokeWidth="1" />
              <rect x="24" y="73" width="20" height="5" rx="1.5" fill="#735726" />
              <rect x="26" y="79" width="16" height="5" rx="1" fill="#59431d" />
              <ellipse cx="34" cy="85" rx="6" ry="3" fill="#2b200d" />
            </svg>
          </button>

          {/* Socket 1: Keeper Terminal */}
          <div className="mt-4 flex flex-col items-center">
            <button
              type="button"
              onClick={() => handleDirectConnect('keeper')}
              className={`relative w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                connectedSocket === 'keeper'
                  ? 'bg-[#C49A55]/25 border-[#C49A55] shadow-[0_0_25px_rgba(196,154,85,0.6)]'
                  : 'bg-[#263447]/90 border-[#C49A55]/40 hover:border-[#C49A55]'
              }`}
            >
              {/* Receptacle Jack Hole */}
              <div className="w-7 h-7 rounded-full bg-[#0d1117] border-2 border-[#C49A55]/80 flex items-center justify-center shadow-inner">
                <div
                  className={`w-3.5 h-3.5 rounded-full transition-colors ${
                    connectedSocket === 'keeper' ? 'bg-[#C49A55] shadow-[0_0_10px_#C49A55]' : 'bg-[#141821]'
                  }`}
                />
              </div>

              {/* Snap Target Indicator */}
              {isDragging && (
                <div className="absolute -inset-2 rounded-3xl border-2 border-dashed border-[#C49A55] animate-spin-slow pointer-events-none opacity-60" />
              )}
            </button>

            {/* Terminal Label Plate */}
            <div className="mt-2 text-center">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C49A55] block">
                KEEPER PORTAL
              </span>
              <span className="text-[10px] text-[#F1E7D0]/60 font-sans">
                Lab Heads &amp; Custodians
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* RIGHT STATION: SEEKER (BULB 2 & SOCKET 2) */}
        {/* ===================================================================== */}
        <div
          className="absolute flex flex-col items-center"
          style={{
            left: `${socketSeeker.x}px`,
            top: `${socketSeeker.bulbY}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {/* Bulb 2: Plasma Arc Halogen Lamp (Seeker) */}
          <button
            type="button"
            onClick={() => handleDirectConnect('seeker')}
            className="group relative cursor-pointer focus:outline-none"
            title="Click to plug in Seeker Portal"
          >
            {/* Radial Light Halo when active */}
            <div
              className={`absolute -inset-8 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
                connectedSocket === 'seeker'
                  ? 'bg-[#67C7D4] opacity-80 scale-125'
                  : 'bg-[#67C7D4]/10 opacity-20 group-hover:opacity-40'
              }`}
            />

            {/* Downward light beam projection */}
            {connectedSocket === 'seeker' && (
              <div
                className="absolute top-16 left-1/2 -translate-x-1/2 w-48 h-56 bg-gradient-to-b from-[#67C7D4]/40 via-[#67C7D4]/15 to-transparent blur-md pointer-events-none"
                style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)' }}
              />
            )}

            {/* Realistic Light Bulb SVG */}
            <svg width="68" height="92" viewBox="0 0 68 92" className="relative z-10 transition-transform duration-300 group-hover:scale-105">
              {/* Glass Envelope */}
              <path
                d="M 34 8 C 18 8 10 20 10 36 C 10 48 18 56 22 66 L 46 66 C 50 56 58 48 58 36 C 58 20 50 8 34 8 Z"
                fill={connectedSocket === 'seeker' ? '#d9f8fc' : '#1a2230'}
                stroke={connectedSocket === 'seeker' ? '#67C7D4' : '#263447'}
                strokeWidth="2.5"
                className="transition-colors duration-500"
              />
              {/* Plasma Electrodes & Arc */}
              <path
                d="M 28 66 L 28 44 L 32 36 L 36 36 L 40 44 L 40 66"
                stroke={connectedSocket === 'seeker' ? '#ffffff' : '#24535a'}
                strokeWidth={connectedSocket === 'seeker' ? '3' : '1.5'}
                fill="none"
                strokeLinecap="round"
                className="transition-colors duration-300"
              />
              {/* Internal Cyan Arc Glow */}
              {connectedSocket === 'seeker' && (
                <circle cx="34" cy="38" r="8" fill="#a0f2fc" className="animate-pulse" />
              )}
              {/* Metal Screw Base */}
              <rect x="22" y="66" width="24" height="6" rx="2" fill="#2d6067" stroke="#67C7D4" strokeWidth="1" />
              <rect x="24" y="73" width="20" height="5" rx="1.5" fill="#22484d" />
              <rect x="26" y="79" width="16" height="5" rx="1" fill="#183236" />
              <ellipse cx="34" cy="85" rx="6" ry="3" fill="#0d1c1e" />
            </svg>
          </button>

          {/* Socket 2: Seeker Terminal */}
          <div className="mt-4 flex flex-col items-center">
            <button
              type="button"
              onClick={() => handleDirectConnect('seeker')}
              className={`relative w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                connectedSocket === 'seeker'
                  ? 'bg-[#67C7D4]/25 border-[#67C7D4] shadow-[0_0_25px_rgba(103,199,212,0.6)]'
                  : 'bg-[#263447]/90 border-[#67C7D4]/40 hover:border-[#67C7D4]'
              }`}
            >
              {/* Receptacle Jack Hole */}
              <div className="w-7 h-7 rounded-full bg-[#0d1117] border-2 border-[#67C7D4]/80 flex items-center justify-center shadow-inner">
                <div
                  className={`w-3.5 h-3.5 rounded-full transition-colors ${
                    connectedSocket === 'seeker' ? 'bg-[#67C7D4] shadow-[0_0_10px_#67C7D4]' : 'bg-[#141821]'
                  }`}
                />
              </div>

              {/* Snap Target Indicator */}
              {isDragging && (
                <div className="absolute -inset-2 rounded-3xl border-2 border-dashed border-[#67C7D4] animate-spin-slow pointer-events-none opacity-60" />
              )}
            </button>

            {/* Terminal Label Plate */}
            <div className="mt-2 text-center">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#67C7D4] block">
                SEEKER PORTAL
              </span>
              <span className="text-[10px] text-[#F1E7D0]/60 font-sans">
                Students &amp; Innovators
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* SVG CABLE WIRE (VERLET CATENARY BÉZIER SPLINE) */}
        {/* ===================================================================== */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
          {/* Cable drop shadow */}
          <path
            d={cablePath}
            stroke="rgba(0, 0, 0, 0.45)"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            transform="translate(2, 6)"
          />
          {/* Outer insulated jacket */}
          <path
            d={cablePath}
            stroke="#1c2430"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          {/* Cable core highlight */}
          <path
            d={cablePath}
            stroke={connectedSocket === 'keeper' ? '#C49A55' : connectedSocket === 'seeker' ? '#67C7D4' : '#34455c'}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            className="transition-colors duration-300"
          />
        </svg>

        {/* Cable Base Power Source Mount */}
        <div
          className="absolute -translate-x-1/2 z-25 flex flex-col items-center"
          style={{ left: `${cableOrigin.x}px`, bottom: '6px' }}
        >
          <div className="w-14 h-5 rounded-t-xl bg-[#263447] border border-[#C49A55]/40 flex items-center justify-center">
            <span className="text-[8px] font-mono text-[#F1E7D0]/50 tracking-wider uppercase">MAIN AC</span>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* MOVABLE CABLE PLUG (INTERACTIVE GRABBABLE HANDLE) */}
        {/* ===================================================================== */}
        <div
          onPointerDown={(e) => {
            e.preventDefault();
            setIsDragging(true);
            setConnectedSocket(null);
            playSound('pickup');
          }}
          className={`absolute z-30 -translate-x-1/2 -translate-y-1/2 transition-shadow select-none ${
            isDragging ? 'cursor-grabbing scale-110' : 'cursor-grab hover:scale-105'
          }`}
          style={{
            left: `${plugPos.x}px`,
            top: `${plugPos.y}px`,
          }}
        >
          {/* Drag halo / affordance */}
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isDragging
                ? 'bg-white/10 ring-4 ring-[#C49A55]/50'
                : 'hover:bg-white/5'
            }`}
          >
            {/* Jack Plug Graphics */}
            <div className="relative flex flex-col items-center">
              {/* Metal Contact Pin */}
              <div
                className={`w-2.5 h-5 rounded-t-sm shadow-md transition-colors ${
                  connectedSocket === 'keeper'
                    ? 'bg-[#C49A55]'
                    : connectedSocket === 'seeker'
                    ? 'bg-[#67C7D4]'
                    : 'bg-gradient-to-b from-amber-200 to-amber-500'
                }`}
              />
              {/* Insulator Ring */}
              <div className="w-2.5 h-1 bg-[#141821]" />
              {/* Jack Collar */}
              <div className="w-3.5 h-2 bg-slate-400" />
              {/* Heavy duty rubber grip barrel */}
              <div className="w-6 h-9 rounded-md bg-gradient-to-r from-[#263447] via-[#3a4d66] to-[#263447] border border-slate-600 flex flex-col items-center justify-center gap-1 shadow-xl">
                {/* Grip Ribs */}
                <div className="w-4 h-0.5 bg-slate-500/70" />
                <div className="w-4 h-0.5 bg-slate-500/70" />
                <div className="w-4 h-0.5 bg-slate-500/70" />
              </div>
              {/* Strain Relief Boot */}
              <div className="w-4 h-3 bg-[#1c2430] rounded-b-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons (Fallback below bench) */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl">
        <button
          type="button"
          onClick={() => handleDirectConnect('keeper')}
          className="w-full sm:w-1/2 py-3.5 px-5 rounded-2xl bg-[#263447]/90 hover:bg-[#263447] border border-[#C49A55]/40 hover:border-[#C49A55] text-[#F1E7D0] font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition shadow-lg backdrop-blur-md group"
        >
          <Shield className="w-4 h-4 text-[#C49A55]" />
          <span>Connect as Keeper</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#C49A55] group-hover:translate-x-0.5 transition" />
        </button>

        <button
          type="button"
          onClick={() => handleDirectConnect('seeker')}
          className="w-full sm:w-1/2 py-3.5 px-5 rounded-2xl bg-[#263447]/90 hover:bg-[#263447] border border-[#67C7D4]/40 hover:border-[#67C7D4] text-[#F1E7D0] font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition shadow-lg backdrop-blur-md group"
        >
          <Compass className="w-4 h-4 text-[#67C7D4]" />
          <span>Connect as Seeker</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#67C7D4] group-hover:translate-x-0.5 transition" />
        </button>
      </div>

      {/* ======================================================================= */}
      {/* DEMO PROFILES TRAY (TOGGLEABLE ACCORDION FOR RAPID HACKATHON EVALUATION) */}
      {/* ======================================================================= */}
      <div className="mt-6 w-full max-w-xl text-center">
        <button
          type="button"
          onClick={() => setShowDemoTray(!showDemoTray)}
          className="inline-flex items-center gap-1.5 text-xs text-[#F1E7D0]/60 hover:text-[#C49A55] transition font-mono"
        >
          <UserCheck className="w-3.5 h-3.5 text-[#C49A55]" />
          <span>{showDemoTray ? 'Hide Instant Demo Profiles' : 'Show Instant Demo Profiles (2 Colleges • 1 School)'}</span>
        </button>

        <AnimatePresence>
          {showDemoTray && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 rounded-2xl bg-[#141821]/95 border border-[#263447] shadow-xl text-left space-y-4 overflow-hidden"
            >
              {/* Keepers */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C49A55] font-bold block mb-2">
                  Keeper Demo Accounts (Hardware Custodians)
                </span>
                <div className="space-y-1.5">
                  {keepers.map((u, idx) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleDemoLogin(u.id, '/sender')}
                      disabled={loadingDemoId !== null}
                      className="w-full text-left p-2.5 rounded-xl bg-[#263447]/60 hover:bg-[#263447] border border-[#263447] hover:border-[#C49A55]/50 flex items-center justify-between transition group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-bold text-[#F1E7D0] group-hover:text-[#C49A55] flex items-center gap-1.5">
                          <span>{u.name}</span>
                          <span className="text-[8px] font-mono uppercase px-1 py-0.2 rounded bg-[#C49A55]/15 text-[#C49A55] border border-[#C49A55]/30">
                            {idx === 2 ? 'School' : 'College'}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#F1E7D0]/60 truncate mt-0.5">
                          {u.instituteName} • {u.post}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#F1E7D0]/40 group-hover:text-[#C49A55] transition shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Seekers */}
              <div className="pt-2 border-t border-[#263447]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#67C7D4] font-bold block mb-2">
                  Seeker Demo Accounts (Students &amp; Mentors)
                </span>
                <div className="space-y-1.5">
                  {seekers.map((u, idx) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleDemoLogin(u.id, '/receiver')}
                      disabled={loadingDemoId !== null}
                      className="w-full text-left p-2.5 rounded-xl bg-[#263447]/60 hover:bg-[#263447] border border-[#263447] hover:border-[#67C7D4]/50 flex items-center justify-between transition group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-bold text-[#F1E7D0] group-hover:text-[#67C7D4] flex items-center gap-1.5">
                          <span>{u.name}</span>
                          <span className="text-[8px] font-mono uppercase px-1 py-0.2 rounded bg-[#67C7D4]/15 text-[#67C7D4] border border-[#67C7D4]/30">
                            {idx === 2 ? 'School' : 'College'}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#F1E7D0]/60 truncate mt-0.5">
                          {u.instituteName} • {u.post}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#F1E7D0]/40 group-hover:text-[#67C7D4] transition shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fictional Institutions Ledger */}
      <div className="mt-8 text-center text-xs text-[#F1E7D0]/50 font-mono flex flex-wrap items-center justify-center gap-4 border-t border-[#263447]/80 pt-5 w-full max-w-2xl">
        <span className="flex items-center gap-1.5 text-[#C49A55]">
          <Building2 className="w-3.5 h-3.5" /> Apex Institute of Technology (College 1)
        </span>
        <span className="text-[#263447]">•</span>
        <span className="flex items-center gap-1.5 text-[#C49A55]">
          <Building2 className="w-3.5 h-3.5" /> Vanguard Engineering College (College 2)
        </span>
        <span className="text-[#263447]">•</span>
        <span className="flex items-center gap-1.5 text-[#67C7D4]">
          <GraduationCap className="w-3.5 h-3.5" /> Horizon STEM Academy (School 1)
        </span>
      </div>
    </div>
  );
}
