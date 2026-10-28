'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Resource } from '@/types/database';
import { formatCurrency, getStatusBadge } from '@/lib/utils';
import {
  Cpu,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface MatcherClientProps {
  resources: Resource[];
}

interface MatchResult {
  resource: Resource;
  role: string;
  reason: string;
}

interface ProjectPreset {
  id: string;
  title: string;
  prompt: string;
  description: string;
  requiredRoles: { role: string; keywords: string[]; explanation: string }[];
  missingComponentsNotice?: string[];
}

const PRESETS: ProjectPreset[] = [
  {
    id: 'obstacle_robot',
    title: 'Obstacle-Avoiding Autonomous Robot',
    prompt: 'I want to build an obstacle-avoiding 4WD robot with distance sensing and motor driver using an Arduino.',
    description: 'Autonomous ground rover using ultrasonic ping sensing to navigate around laboratory obstacles.',
    requiredRoles: [
      {
        role: 'Microcontroller Controller',
        keywords: ['arduino', 'uno'],
        explanation: 'Coordinates motor pulse signals, reads distance triggers, and computes obstacle clearance angles.',
      },
      {
        role: 'Robotics Chassis & Motor Driver',
        keywords: ['4wd', 'robot', 'chassis', 'l298n'],
        explanation: 'Provides DC TT gear motors, wheels, dual H-bridge driver, and mechanical mounting decks.',
      },
    ],
    missingComponentsNotice: [
      'Ultrasonic HC-SR04 sensor module (Standard lab consumables box)',
      '4x AA Battery or 2x 18650 Battery Pack with DC barrel plug',
    ],
  },
  {
    id: 'iot_weather',
    title: 'Connected IoT Environmental Weather Station',
    prompt: 'I want to build a Wi-Fi connected greenhouse temperature and humidity monitor publishing MQTT data.',
    description: 'Edge node logging ambient telemetry and streaming metrics over 802.11 Wi-Fi to a cloud dashboard.',
    requiredRoles: [
      {
        role: 'IoT Microcontroller SoC',
        keywords: ['esp32', 'esp-32', 'nodemcu'],
        explanation: 'Integrated dual-band 240MHz processor and Wi-Fi stack for local sensor processing and MQTT publishing.',
      },
      {
        role: 'Climate / Humidity Sensor',
        keywords: ['dht11', 'temperature', 'humidity'],
        explanation: 'Measures ambient thermal levels (0-50 C) and relative humidity (20-90% RH) via single-wire digital interface.',
      },
    ],
    missingComponentsNotice: [
      'Micro-USB programming cable and 5V 1A wall adaptor',
      'Mini solderless breadboard and jumper wires',
    ],
  },
  {
    id: 'edge_vision',
    title: 'Edge Computer Vision & AI Inference Node',
    prompt: 'I want to build an edge visual inspection system using OpenCV on an embedded Linux computer.',
    description: 'High performance edge Linux board running embedded neural network classifiers locally.',
    requiredRoles: [
      {
        role: 'Single-Board Computer',
        keywords: ['raspberry', 'pi', 'rpi'],
        explanation: 'Quad-core Cortex-A72 with 4GB RAM capable of running full 64-bit Linux OS and lightweight TensorFlow models.',
      },
      {
        role: 'Testing & Diagnostics Multimeter',
        keywords: ['multimeter', 'fluke'],
        explanation: 'Safely checks 5V/3A GPIO power rail stability and current draw to avoid board brownouts.',
      },
    ],
    missingComponentsNotice: [
      'USB Webcam or Raspberry Pi Camera Module v2',
      'External HDMI monitor or headless SSH configuration',
    ],
  },
  {
    id: 'circuit_debug',
    title: 'Precision RF & Signal Analysis Bench',
    prompt: 'I want to debug an SPI bus waveform and measure circuit frequencies and signal noise.',
    description: 'Multi-channel deep memory bench setup for hardware prototyping and high-frequency debugging.',
    requiredRoles: [
      {
        role: 'Digital Storage Oscilloscope',
        keywords: ['oscilloscope', 'rigol'],
        explanation: '4-channel 50MHz 1GSa/s scope for visualizing waveform harmonics, rise times, and bus signals. Requires training certification.',
      },
      {
        role: 'Precision Digital Multimeter',
        keywords: ['multimeter', 'fluke'],
        explanation: 'True-RMS verification of circuit continuity, DC reference voltages, and capacitance.',
      },
    ],
  },
];

export function MatcherClient({ resources }: MatcherClientProps) {
  const [query, setQuery] = useState(PRESETS[0].prompt);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESETS[0].id);

  const activePreset = PRESETS.find((p) => p.id === selectedPresetId);

  // Deterministic Match Calculation
  const matchedResults: MatchResult[] = [];
  const currentQueryLower = query.toLowerCase();

  // 1. Evaluate rules from active preset or keyword patterns
  if (activePreset) {
    for (const req of activePreset.requiredRoles) {
      const match = resources.find((r) => {
        const text = `${r.name} ${r.category} ${r.slug} ${r.description}`.toLowerCase();
        return req.keywords.some((kw) => text.includes(kw));
      });

      if (match) {
        matchedResults.push({
          resource: match,
          role: req.role,
          reason: req.explanation,
        });
      }
    }
  } else {
    // Freeform query fallback matcher
    for (const r of resources) {
      const text = `${r.name} ${r.category} ${r.description}`.toLowerCase();
      const words = currentQueryLower.split(/\s+/).filter((w) => w.length > 3);
      const matches = words.some((w) => text.includes(w));
      if (matches) {
        matchedResults.push({
          resource: r,
          role: r.category.replace('_', ' ').toUpperCase(),
          reason: `Matched your search terms based on hardware category and capability description.`,
        });
      }
    }
  }

  const handleSelectPreset = (p: ProjectPreset) => {
    setSelectedPresetId(p.id);
    setQuery(p.prompt);
  };

  const handleFreeformChange = (val: string) => {
    setQuery(val);
    setSelectedPresetId(''); // clear preset selection
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Preset Selector */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
          Select a Popular Project Template:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((p) => {
            const isSelected = selectedPresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/70 border-cyan-500 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center justify-between">
                    {p.title}
                    {isSelected && <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Query Input Box */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
        <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <Search className="w-4 h-4 text-cyan-400" />
          Project Goal or Description:
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => handleFreeformChange(e.target.value)}
            placeholder="e.g. I want to build an obstacle-avoiding robot using an Arduino."
            className="flex-1 bg-navy-850 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Matched Inventory Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Recommended Compatible Components ({matchedResults.length})
          </h2>
          <span className="text-xs text-slate-400">Queried from real institutional database</span>
        </div>

        {matchedResults.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-white">No direct component matches found for this description</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Try selecting one of the verified project templates above or searching for specific items like Arduino or ESP32.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {matchedResults.map((m, idx) => {
              const r = m.resource;
              const cond = getStatusBadge(r.condition);
              const isFree = r.daily_rate_paise === 0;

              return (
                <div
                  key={`${r.id}-${idx}`}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                >
                  <div className="flex items-start gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.image_url || 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=200'}
                      alt={r.name}
                      className="w-20 h-20 rounded-xl object-cover bg-slate-950 shrink-0 border border-slate-800"
                    />

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                          ROLE: {m.role}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${cond.bg} ${cond.text} ${cond.border}`}>
                          {cond.label}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Building className="w-3.5 h-3.5" />
                          {r.institution?.name}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white mt-1.5">{r.name}</h3>

                      <p className="text-xs text-cyan-200/90 mt-1.5 bg-navy-850 px-3 py-1.5 rounded-lg border border-slate-800 max-w-2xl">
                        💡 <strong>Why needed:</strong> {m.reason}
                      </p>

                      <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                        <span className="font-semibold text-white">
                          Rental: {formatCurrency(r.daily_rate_paise)} {isFree ? '' : '/ day'}
                        </span>
                        <span>
                          Deposit: <strong className="text-slate-200">{r.deposit_paise > 0 ? formatCurrency(r.deposit_paise, false) : 'None'}</strong>
                        </span>
                        <span className="text-emerald-400 font-semibold">
                          {r.available_quantity} available in stock
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/resources/${r.id}`}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs shrink-0 transition-colors flex items-center gap-1.5 self-end md:self-center shadow-md shadow-cyan-500/20"
                  >
                    Request Item
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Missing Components Identification */}
      {activePreset?.missingComponentsNotice && activePreset.missingComponentsNotice.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-xs">
          <h3 className="font-bold text-amber-300 flex items-center gap-2 mb-2 text-sm">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            Missing Ancillary Components Notice
          </h3>
          <p className="text-slate-300 mb-3">
            Based on the technical build specification for this project, you will also need the following common consumables or accessories:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            {activePreset.missingComponentsNotice.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
