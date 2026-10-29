'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Experiment } from '@/components/experiment/Experiment';
import type { ExperimentHandle, ExperimentState } from '@/components/experiment/types';
import { DEMO_USERS } from '@/lib/auth/demo-users';
import { switchDemoUser, enterPortalAction } from '@/app/actions/auth';
import {
  MousePointer2,
  ArrowUpRight,
  MoveUpRight,
  RotateCcw,
  Volume2,
  VolumeX,
  Check,
  X,
  Shield,
  Compass,
  UserCheck,
  HelpCircle,
  Sparkles,
  Plug,
} from 'lucide-react';

export function Scene3DLanding() {
  const router = useRouter();
  const experiment = useRef<ExperimentHandle>(null);

  const [state, setState] = useState<ExperimentState>({
    connected: [false, false],
    connectedSocket: null,
    dragging: false,
    nearSocket: null,
    ready: false,
  });

  const [sound, setSound] = useState(true);
  const [guide, setGuide] = useState(false);
  const [showDemoTray, setShowDemoTray] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [loadingDemoId, setLoadingDemoId] = useState<string | null>(null);

  const keepers = DEMO_USERS.filter((u) => u.platformType === 'sender');
  const seekers = DEMO_USERS.filter((u) => u.platformType === 'receiver');

  // Navigate when a socket connects
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state.connectedSocket === 'keeper') {
      timer = setTimeout(async () => {
        try {
          await enterPortalAction('keeper');
        } catch (e) {
          console.error(e);
        }
        window.location.href = '/sender?role=keeper';
      }, 950);
    } else if (state.connectedSocket === 'seeker') {
      timer = setTimeout(async () => {
        try {
          await enterPortalAction('seeker');
        } catch (e) {
          console.error(e);
        }
        window.location.href = '/receiver?role=seeker';
      }, 950);
    }
    return () => clearTimeout(timer);
  }, [state.connectedSocket]);

  function start() {
    setGuide(true);
    document
      .querySelector<HTMLElement>('.experiment-canvas')
      ?.focus({ preventScroll: true });
  }

  function reset() {
    experiment.current?.reset();
    setGuide(false);
  }

  const message = state.dragging
    ? state.nearSocket !== null
      ? state.nearSocket === 0
        ? 'A perfect fit. Release to connect to Keeper Portal.'
        : 'A perfect fit. Release to connect to Seeker Portal.'
      : 'A little closer. Bring the plug to Socket 01 or 02.'
    : state.connectedSocket === 'keeper'
    ? '⚡ Circuit Complete! Keeper Portal Activated (Prof. Alistair Vance). Entering Keeper Desk...'
    : state.connectedSocket === 'seeker'
    ? '⚡ Circuit Complete! Seeker Portal Activated (Rohan Verma). Entering Seeker Lab...'
    : 'Pick up the single plug from the floor to connect.';

  const handleDemoLogin = async (userId: string, targetPath: string) => {
    setLoadingDemoId(userId);
    try {
      await switchDemoUser(userId);
      window.location.href = targetPath;
    } catch {
      window.location.href = targetPath;
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#f3efe6] text-[#2b3029] select-none relative overflow-x-hidden min-h-screen">
      {/* ========================================================================= */}
      {/* 1. TOP SITE HEADER INSPIRED BY LIVEWIRE */}
      {/* ========================================================================= */}
      <header className="h-20 sm:h-24 px-4 sm:px-8 lg:px-12 flex items-center justify-between border-b border-[#dcd7cb] relative z-20 bg-[#f3efe6]/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-[#ba4d2b] flex items-center justify-center text-white shadow-sm">
            <Plug className="w-4 h-4" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#2b3029]">
            IO<span className="text-[#ba4d2b]">Together</span>
            <span className="text-[#ba4d2b] font-mono text-xl">.</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2.5 font-mono text-[10px] tracking-widest text-[#7f7b6d] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ba4d2b]" />
          A PLAYGROUND FOR POSSIBILITY — MULTI-INSTITUTION ELECTRONICS SHARING
        </div>

        <nav className="flex items-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={() => setShowHelpDialog(true)}
            className="flex items-center gap-1.5 text-xs text-[#77786c] hover:text-[#ba4d2b] transition font-sans font-medium"
          >
            How it works <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <span className="h-4 w-px bg-[#dcd7cb] hidden sm:block" />
          <button
            type="button"
            onClick={start}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#ba4d2b] hover:text-[#9d442b] transition font-sans"
          >
            Try the Cable <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </nav>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION: EDITORIAL OVERLAY & FULL 3D EXPERIMENT */}
      {/* ========================================================================= */}
      <section className="relative flex-1 min-h-[640px] h-[calc(100vh-185px)] max-h-[880px] w-full overflow-hidden">
        {/* Full-bleed Three.js Canvas Container */}
        <div className="absolute inset-0 w-full h-full z-10">
          <Experiment ref={experiment} onState={setState} sound={sound} />

          {/* Floating 3D Scene Label */}
          <div className="absolute top-5 right-6 sm:right-10 flex items-center gap-2 text-[9px] font-mono tracking-wider text-[#8d897b] pointer-events-none z-20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ba4d2b]" />
            <span>LIVE IN 3D</span>
            <span className="text-[#c2bbaa]">/</span>
            <span>SINGLE-SIDED GRAVITY</span>
          </div>

          {/* Floating Depth Controls while Dragging */}
          {state.dragging && (
            <div className="absolute top-14 right-6 sm:right-10 flex items-center gap-1.5 bg-[#f5f1e5]/90 border border-[#d5cebd] px-2.5 py-1.5 rounded-lg shadow-sm backdrop-blur-md text-[10px] font-mono text-[#77786c] z-20">
              <span className="mr-1 text-[9px] font-bold text-[#ba4d2b]">DEPTH</span>
              <button
                type="button"
                aria-label="Move cable closer"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  experiment.current?.adjustDepth(0.28);
                }}
                className="px-2 py-0.5 rounded bg-white/90 border border-[#d5cebd] hover:border-[#ba4d2b] hover:text-[#ba4d2b] transition"
              >
                + NEAR
              </button>
              <button
                type="button"
                aria-label="Move cable further"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  experiment.current?.adjustDepth(-0.28);
                }}
                className="px-2 py-0.5 rounded bg-white/90 border border-[#d5cebd] hover:border-[#ba4d2b] hover:text-[#ba4d2b] transition"
              >
                − FAR
              </button>
            </div>
          )}

          {/* Guidance Callout */}
          {guide && !state.dragging && !state.connectedSocket && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 sm:left-auto sm:right-48 sm:translate-x-0 flex items-center gap-3 bg-[#faf7ee] border border-[#d9ceba] shadow-lg rounded-lg px-4 py-2.5 text-xs text-[#88816e] max-w-xs animate-in fade-in slide-in-from-bottom-2 z-20">
              <MousePointer2 className="w-4 h-4 text-[#ba4d2b] shrink-0" />
              <div className="text-[11px] leading-snug">
                Grab the physical plug on the floor.
                <br />
                <strong className="text-[#414b38] font-semibold">Drag it up to Socket 01 or 02.</strong>
              </div>
              <button
                type="button"
                aria-label="Dismiss guide"
                onClick={() => setGuide(false)}
                className="p-1 text-[#999581] hover:text-[#ba4d2b]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Live Dynamic Status Message Pill */}
          <div
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono backdrop-blur-md shadow-sm transition-all pointer-events-none z-20 ${
              state.dragging || state.connectedSocket
                ? 'bg-white/95 border-[#ba4d2b]/60 text-[#ba4d2b]'
                : 'bg-[#f5f1e5]/90 border-[#d5cebd]/80 text-[#77796b]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                state.connectedSocket
                  ? 'bg-[#ba4d2b] shadow-[0_0_8px_#ba4d2b] animate-pulse'
                  : state.dragging
                  ? 'bg-[#ba4d2b]'
                  : 'bg-[#939a82]'
              }`}
            />
            <span>{message}</span>
          </div>

          {/* Subtle Chamber Coordinates */}
          <span className="absolute bottom-6 right-8 font-mono text-[9px] tracking-widest text-[#b0a995] pointer-events-none hidden sm:block z-20">
            01 — 02
          </span>
        </div>

        {/* Soft feathering overlay behind left editorial copy */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-full sm:w-[480px] lg:w-[560px] bg-gradient-to-r from-[#f3efe6] via-[#f3efe6]/90 to-transparent pointer-events-none z-15"
        />

        {/* Left Hero Editorial Copy */}
        <div className="absolute left-6 sm:left-10 lg:left-14 top-8 sm:top-12 z-20 max-w-sm sm:max-w-md pointer-events-none">
          <div className="eyebrow flex items-center gap-3 font-mono text-[9px] tracking-wider text-[#7f7b6d] uppercase mb-4">
            <span className="text-[#ba4d2b] font-bold">N° 001</span>
            <span className="w-6 h-px bg-[#c7bcaa]" />
            <span>WALL-HINGED SINGLE-SIDED CABLE</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl xl:text-7xl leading-[0.96] tracking-tight font-normal text-[#2b3029] mb-5">
            Make a<br />
            <em className="text-[#ba4d2b] not-italic font-normal">connection.</em>
          </h1>

          <p className="text-xs sm:text-sm text-[#77786c] leading-relaxed max-w-xs sm:max-w-sm mb-6 font-light">
            The cable hangs hinged from the wall. Pick up the free plug and connect it to either wall socket to enter the Keeper or Seeker chamber.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pointer-events-auto">
            <button
              type="button"
              onClick={start}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#ba4d2b] hover:bg-[#9d442b] text-[#fff6e9] text-xs font-semibold shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <MousePointer2 className="w-3.5 h-3.5" />
              <span>Pick up the plug</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </button>

            <button
              type="button"
              onClick={() => experiment.current?.connectTo(0)}
              className="inline-flex items-center gap-1.5 text-xs text-[#77786c] hover:text-[#ba4d2b] transition font-mono underline underline-offset-4"
            >
              Test Keeper (01)
            </button>
            <span className="text-[#c7bcaa] font-mono text-xs">•</span>
            <button
              type="button"
              onClick={() => experiment.current?.connectTo(1)}
              className="inline-flex items-center gap-1.5 text-xs text-[#77786c] hover:text-[#0891B2] transition font-mono underline underline-offset-4"
            >
              Test Seeker (02)
            </button>
          </div>

          <div className="flex items-center gap-2 mt-4 text-[10px] text-[#8c8b7e] font-sans">
            <span className="w-3.5 h-px bg-[#bbb5a5]" />
            <span>Drag in 3D. Connect. Let there be light.</span>
          </div>

          <div className="flex items-center gap-3 mt-6 sm:mt-10 text-[10px] text-[#8d8b7d] font-mono leading-tight">
            <span className="text-2xl text-[#b9ae9b] font-light leading-none">+</span>
            <div>
              Multi-institution verified inventory.
              <br />
              Lab Custodians &amp; Student Innovators.
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTION STATUS BAR INSPIRED BY LIVEWIRE */}
      {/* ========================================================================= */}
      <section className="mx-4 sm:mx-8 lg:mx-12 py-4 border-t border-b border-[#dcd7cb] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-20 bg-[#f3efe6]">
        {/* Left Instruction */}
        <div className="flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-full border border-[#dcd7cb] flex items-center justify-center text-[#77786c] shrink-0">
            <MoveUpRight className="w-4 h-4 text-[#ba4d2b]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#2b3029]">
              A little nudge is all it takes.
            </div>
            <div className="text-[11px] text-[#77786c]">
              Drag the plug into Socket 01 (Keeper) or Socket 02 (Seeker).
            </div>
          </div>
        </div>

        {/* Center Circuit Status LEDs */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Socket 01 (Keeper) */}
          <button
            type="button"
            onClick={() => experiment.current?.connectTo(0)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-mono transition ${
              state.connected[0]
                ? 'bg-amber-50 border-[#C49A55] text-amber-900 shadow-sm'
                : 'bg-white/60 border-[#dcd7cb] text-[#77786c] hover:border-[#C49A55]'
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                state.connected[0] ? 'bg-[#C49A55] text-white' : 'bg-[#dcd7cb]'
              }`}
            >
              {state.connected[0] && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </span>
            <span className="font-bold">01 KEEPER PORTAL</span>
            <span className="text-[10px] text-[#8c8b7e]">
              {state.connected[0] ? 'CONNECTED' : 'AWAITING'}
            </span>
          </button>

          {/* Socket 02 (Seeker) */}
          <button
            type="button"
            onClick={() => experiment.current?.connectTo(1)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-mono transition ${
              state.connected[1]
                ? 'bg-cyan-50 border-[#0891B2] text-cyan-900 shadow-sm'
                : 'bg-white/60 border-[#dcd7cb] text-[#77786c] hover:border-[#0891B2]'
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                state.connected[1] ? 'bg-[#0891B2] text-white' : 'bg-[#dcd7cb]'
              }`}
            >
              {state.connected[1] && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </span>
            <span className="font-bold">02 SEEKER PORTAL</span>
            <span className="text-[10px] text-[#8c8b7e]">
              {state.connected[1] ? 'CONNECTED' : 'AWAITING'}
            </span>
          </button>
        </div>

        {/* Right Tools: Reset, Sound, Demo Profiles */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#dcd7cb] bg-white/70 hover:bg-white text-xs font-sans text-[#77786c] hover:text-[#2b3029] transition shadow-xs"
            title="Reset Cable to Floor"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={() => setSound(!sound)}
            className={`p-2 rounded-md border text-xs transition ${
              sound
                ? 'border-[#ba4d2b]/40 text-[#ba4d2b] bg-white'
                : 'border-[#dcd7cb] text-[#999581] bg-white/60'
            }`}
            title={sound ? 'Mute Sound' : 'Enable Sound'}
          >
            {sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setShowDemoTray(!showDemoTray)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#dcd7cb] bg-white/70 hover:bg-white text-xs font-sans text-[#77786c] hover:text-[#ba4d2b] transition shadow-xs"
            title="Switch Demo Profiles"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#ba4d2b]" />
            <span className="hidden sm:inline">Demo Personas</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. EXPANDABLE DEMO TRAY (2 COLLEGES • 1 SCHOOL) */}
      {/* ========================================================================= */}
      {showDemoTray && (
        <div className="mx-4 sm:mx-8 lg:mx-12 my-3 p-4 rounded-xl bg-white border border-[#dcd7cb] shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 relative z-30">
          <div className="flex items-center justify-between pb-3 border-b border-[#ece7dd] mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ba4d2b] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> One-Click Academic Demo Personas (2 Colleges • 1 School)
            </span>
            <button
              onClick={() => setShowDemoTray(false)}
              className="text-xs text-[#999581] hover:text-[#2b3029]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Keepers Column */}
            <div>
              <span className="text-[11px] font-mono font-bold text-amber-800 uppercase block mb-1.5">
                Keepers (Lab Heads &amp; Equipment Custodians)
              </span>
              <div className="space-y-1.5">
                {keepers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleDemoLogin(u.id, '/sender')}
                    disabled={loadingDemoId !== null}
                    className="w-full text-left p-2.5 rounded-lg bg-amber-50/50 hover:bg-amber-50 border border-amber-200/80 text-xs flex items-center justify-between group transition"
                  >
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-amber-800">{u.name}</span>
                      <span className="text-[10px] text-slate-500 block">{u.instituteName}</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-800" />
                  </button>
                ))}
              </div>
            </div>

            {/* Seekers Column */}
            <div>
              <span className="text-[11px] font-mono font-bold text-cyan-800 uppercase block mb-1.5">
                Seekers (Student Borrowers &amp; Makers)
              </span>
              <div className="space-y-1.5">
                {seekers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleDemoLogin(u.id, '/receiver')}
                    disabled={loadingDemoId !== null}
                    className="w-full text-left p-2.5 rounded-lg bg-cyan-50/50 hover:bg-cyan-50 border border-cyan-200/80 text-xs flex items-center justify-between group transition"
                  >
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-cyan-800">{u.name}</span>
                      <span className="text-[10px] text-slate-500 block">{u.instituteName}</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-800" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. HOW IT WORKS DIALOG */}
      {/* ========================================================================= */}
      {showHelpDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#faf7ee] border border-[#d9ceba] rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowHelpDialog(false)}
              className="absolute top-4 right-4 p-1 text-[#999581] hover:text-[#2b3029]"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#ba4d2b] font-bold mb-1">
              FIELD GUIDE — IOTOGETHER 3D CHAMBER
            </div>
            <h3 className="font-serif text-2xl font-normal text-[#2b3029] mb-3">
              Single-Sided Cable Interaction
            </h3>
            <div className="space-y-3 text-xs text-[#77786c] leading-relaxed font-sans">
              <p>
                <strong>1. Wall Conduit Hinge:</strong> The cable hangs hinged from the wall conduit outside the frame. It obeys real position-based Verlet dynamics with gravity and friction.
              </p>
              <p>
                <strong>2. Free Grabbable Plug:</strong> Click and drag the single dark plug on the floor. Scroll your mouse wheel or use the floating depth buttons to push the plug closer to or further from the wall.
              </p>
              <p>
                <strong>3. Sockets &amp; Edison Bulbs:</strong>
                <br />
                • Drag to <strong>Socket 01</strong>: Keeper Portal activates &amp; the left bulb glows warm amber.
                <br />
                • Drag to <strong>Socket 02</strong>: Seeker Portal activates &amp; the right bulb glows electric cyan.
              </p>
              <p>
                <strong>4. Keyboard Controls:</strong> Press <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#d9ceba]">Enter</kbd> to connect next socket, <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#d9ceba]">R</kbd> to reset, and <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#d9ceba]">Esc</kbd> to release.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHelpDialog(false)}
                className="px-4 py-2 rounded-md bg-[#ba4d2b] text-white text-xs font-semibold"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
