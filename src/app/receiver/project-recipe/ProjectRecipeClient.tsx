'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Resource } from '@/types/database';
import {
  Sparkles,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Zap,
  Code2,
  Check,
  Send,
  Loader2,
} from 'lucide-react';

interface ProjectRecipeClientProps {
  resources: Resource[];
}

interface RecipeTemplate {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estDays: number;
  estHours: number;
  description: string;
  requiredComponents: {
    name: string;
    category: string;
    purpose: string;
    matchedResourceId?: string;
  }[];
  wiringNotes: string[];
  firmwareHint: string;
}

const PRESET_RECIPES: RecipeTemplate[] = [
  {
    id: 'smart-agri',
    title: 'Smart Agriculture & Soil Telemetry Station',
    category: 'IoT & Environmental Sensing',
    difficulty: 'Beginner',
    estDays: 3,
    estHours: 6,
    description: 'Autonomous micro-climate and soil moisture monitor with Wi-Fi telemetry and automated relay irrigation pump switching.',
    requiredComponents: [
      { name: 'ESP32 Wi-Fi & Bluetooth NodeMCU', category: 'microcontroller', purpose: 'Main MCU with MQTT & Wi-Fi' },
      { name: 'DHT11 Temperature & Humidity Sensor', category: 'sensor', purpose: 'Ambient atmospheric sensing' },
      { name: 'Soil Moisture Sensor & Probe', category: 'sensor', purpose: 'Volumetric soil water content measurement' },
      { name: '5V Single-Channel Relay Module', category: 'motor', purpose: 'Low-voltage trigger for 12V submersible pump' },
    ],
    wiringNotes: [
      'Connect DHT11 VCC to 3.3V, GND to GND, and DATA pin to GPIO 4 with a 10k pull-up resistor.',
      'Connect Soil Moisture Analog Out (A0) to ESP32 ADC1 (GPIO 34) for 12-bit ADC reading.',
      'Connect Relay Control IN to GPIO 26. Use optocoupled isolation to prevent back-EMF spikes.',
    ],
    firmwareHint: 'PlatformIO / Arduino C++ with PubSubClient for AWS IoT or ThingsBoard telemetry dashboard.',
  },
  {
    id: 'obstacle-robot',
    title: 'Autonomous Obstacle-Avoiding & Line-Following Robot',
    category: 'Robotics & Mechatronics',
    difficulty: 'Intermediate',
    estDays: 4,
    estHours: 0,
    description: 'Dual-mode chassis with ultrasonic range detection, dual IR line tracking arrays, and H-bridge motor driver.',
    requiredComponents: [
      { name: 'Arduino Uno R3 Microcontroller', category: 'microcontroller', purpose: 'Core real-time processing and PWM drive' },
      { name: 'HC-SR04 Ultrasonic Distance Sensor', category: 'sensor', purpose: 'Non-contact sonar distance detection (2cm - 400cm)' },
      { name: 'L298N Dual H-Bridge Motor Driver', category: 'motor', purpose: 'Bidirectional DC motor speed and direction control' },
    ],
    wiringNotes: [
      'Trigger pin to Arduino Digital 9, Echo pin to Digital 10. Beware: Echo produces 5V logic which Arduino handles natively.',
      'L298N requires common ground: connect battery GND to both L298N GND and Arduino GND.',
      'Enable A (ENA) to Pin 5 (PWM), Enable B (ENB) to Pin 6 (PWM) for speed profiling.',
    ],
    firmwareHint: 'Implement a non-blocking state machine using millis() to avoid delay() pauses during obstacle scanning.',
  },
  {
    id: 'wearable-health',
    title: 'Wearable ECG & Wireless Pulse Oximeter',
    category: 'Biomedical & Edge AI',
    difficulty: 'Advanced',
    estDays: 5,
    estHours: 12,
    description: 'Low-noise biomedical signal acquisition module with digital pulse plethysmography and real-time OLED rendering.',
    requiredComponents: [
      { name: 'Raspberry Pi Zero 2 W Kit', category: 'microcontroller', purpose: 'Quad-core Linux edge computer for digital signal filtering' },
      { name: 'DHT11 Temperature & Humidity Sensor', category: 'sensor', purpose: 'Ambient patient chamber temperature' },
      { name: 'Fluke 115 True-RMS Digital Multimeter', category: 'lab_equipment', purpose: 'Verification of reference electrode potential' },
    ],
    wiringNotes: [
      'Power the sensor analog front-end from an isolated 3.3V LDO rail to minimize mains 50Hz hum.',
      'Keep electrode lead wires twisted to reduce common-mode electromagnetic pickup.',
    ],
    firmwareHint: 'Use Python with NumPy and SciPy for real-time Butterworth bandpass filtering (0.5Hz - 40Hz).',
  },
  {
    id: 'lora-weather',
    title: 'LoRa 868MHz Long-Range Disaster Alert Node',
    category: 'Telecommunications & RF',
    difficulty: 'Intermediate',
    estDays: 2,
    estHours: 18,
    description: 'Sub-gigahertz spread-spectrum transceiver node capable of 5km line-of-sight packet transmission for remote weather stations.',
    requiredComponents: [
      { name: 'ESP32 Wi-Fi & Bluetooth NodeMCU', category: 'microcontroller', purpose: 'Low-power sleep MCU and SPI master' },
      { name: 'DHT11 Temperature & Humidity Sensor', category: 'sensor', purpose: 'Micro-climate monitoring' },
    ],
    wiringNotes: [
      'Connect SPI SCK to GPIO 18, MISO to GPIO 19, MOSI to GPIO 23, and NSS to GPIO 5.',
      'ALWAYS attach the 868MHz antenna BEFORE powering the transceiver to prevent PA destruction.',
    ],
    firmwareHint: 'Use RadioLib in deep sleep mode with periodic RTC timer wakeups every 15 minutes to conserve power.',
  },
];

export function ProjectRecipeClient({ resources }: ProjectRecipeClientProps) {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(PRESET_RECIPES[0].id);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customRecipe, setCustomRecipe] = useState<RecipeTemplate | null>(null);

  const activeRecipe = customRecipe || PRESET_RECIPES.find((r) => r.id === selectedRecipeId) || PRESET_RECIPES[0];

  // Match required components with actual database inventory
  const componentsWithInventory = activeRecipe.requiredComponents.map((comp) => {
    const matched = resources.find((r) => {
      const nameMatch = r.name.toLowerCase().includes(comp.name.toLowerCase().split(' ')[0]);
      const catMatch = r.category === comp.category;
      return nameMatch || catMatch;
    });

    return {
      ...comp,
      inventoryItem: matched,
      isAvailable: Boolean(matched && (matched.available_quantity ?? 0) > 0),
    };
  });

  const allAvailable = componentsWithInventory.every((c) => c.isAvailable);

  const handleGenerateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setCustomRecipe({
        id: 'custom-' + Date.now(),
        title: customPrompt.slice(0, 48) + (customPrompt.length > 48 ? '...' : ''),
        category: 'Custom AI Generated',
        difficulty: 'Intermediate',
        estDays: 3,
        estHours: 12,
        description: `Custom solution tailored for: "${customPrompt}". Designed with optimal energy efficiency, noise suppression, and academic laboratory component availability.`,
        requiredComponents: [
          { name: 'ESP32 Wi-Fi & Bluetooth NodeMCU', category: 'microcontroller', purpose: 'Core processing and wireless networking' },
          { name: 'DHT11 Temperature & Humidity Sensor', category: 'sensor', purpose: 'Environmental feedback loop' },
          { name: 'Fluke 115 True-RMS Digital Multimeter', category: 'lab_equipment', purpose: 'Circuit calibration and bias testing' },
        ],
        wiringNotes: [
          'Verify DC rail voltage with multimeter before connecting GPIO lines to avoid over-voltage damage.',
          'Utilize decoupling capacitors (100nF ceramic) close to IC power pins to suppress transient rail noise.',
          'Ensure common ground across all sub-modules and load drivers.',
        ],
        firmwareHint: 'Modular firmware architecture using FreeRTOS tasks for sensor acquisition and network telemetry.',
      });
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* AI Prompt Input Bar */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-950/40 via-neutral-900 to-cyan-950/40 border border-teal-500/30 p-6 shadow-xl">
        <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" /> AI Component Matching & Recipe Engine
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">Have a specific project in mind?</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">
          Enter what you want to build (e.g. &ldquo;Smart solar battery charger with LCD status&rdquo;). Antigravity AI will design the Bill of Materials and check member college inventory.
        </p>

        <form onSubmit={handleGenerateCustom} className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g. Automated greenhouse with soil moisture, DHT11, and relay water valve..."
            className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
          />
          <button
            type="submit"
            disabled={isGenerating || !customPrompt.trim()}
            className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-navy-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 shrink-0"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {isGenerating ? 'Synthesizing...' : 'Generate Recipe'}
          </button>
        </form>
      </div>

      {/* Preset Recipe Selector Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" /> Curated Academic Lab Recipes
          </h3>
          {customRecipe && (
            <button
              onClick={() => setCustomRecipe(null)}
              className="text-xs text-teal-400 hover:underline"
            >
              Reset to Curated Presets
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_RECIPES.map((recipe) => {
            const isSelected = !customRecipe && selectedRecipeId === recipe.id;
            return (
              <button
                key={recipe.id}
                type="button"
                onClick={() => {
                  setCustomRecipe(null);
                  setSelectedRecipeId(recipe.id);
                }}
                className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-neutral-900 border-teal-500 shadow-lg shadow-teal-950/40 ring-1 ring-teal-500/40'
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-neutral-800 text-slate-300">
                      {recipe.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">
                      ~{recipe.estDays}d {recipe.estHours}h loan
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs leading-snug">{recipe.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{recipe.description}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{recipe.requiredComponents.length} components</span>
                  <span className={isSelected ? 'text-teal-400 font-bold' : ''}>
                    {isSelected ? 'Selected' : 'Select'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Recipe Detailed Architecture Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Components & Inventory Status */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-800 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                  {activeRecipe.category}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{activeRecipe.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-neutral-800 text-slate-300 border border-neutral-700">
                  Recommended Duration: {activeRecipe.estDays} Days, {activeRecipe.estHours} Hours
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">{activeRecipe.description}</p>

            {/* Bill of Materials / Inventory Matching Table */}
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" /> Required Bill of Materials & Real-Time Stock
            </h4>

            <div className="space-y-3">
              {componentsWithInventory.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{comp.name}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-slate-400">
                          {comp.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{comp.purpose}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                    {comp.inventoryItem ? (
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          {comp.isAvailable ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({comp.inventoryItem.available_quantity} available)
                            </span>
                          ) : (
                            <span className="text-amber-400 flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> Checked out (Waitlist active)
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {comp.inventoryItem.institution?.name} • ₹{(comp.inventoryItem.daily_rate_paise / 100).toFixed(0)}/day
                        </div>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">Generic component in stock</span>
                    )}

                    {comp.inventoryItem && (
                      <Link
                        href={`/resources/${comp.inventoryItem.id}`}
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-slate-300 hover:text-white transition"
                        title="Book component"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick 1-Click Action for the Recipe */}
            <div className="mt-6 pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                {allAvailable ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> All recipe components are currently available across partner labs!
                  </span>
                ) : (
                  <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Some components are out on loan. You can reserve available ones or join the waitlist.
                  </span>
                )}
              </div>

              {componentsWithInventory[0]?.inventoryItem && (
                <Link
                  href={`/resources/${componentsWithInventory[0].inventoryItem.id}`}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-navy-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" /> Book Primary Component & Start
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Pin-to-Pin Schematic & Firmware Notes */}
        <div className="space-y-6">
          {/* Schematic Pin Notes */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Code2 className="w-4 h-4" /> Pinout & Schematic Wiring Tips
            </h4>
            <ul className="space-y-2.5">
              {activeRecipe.wiringNotes.map((note, idx) => (
                <li key={idx} className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-850 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                  <span className="w-4 h-4 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Firmware & Protocol Hint */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Firmware & Implementation Hint
            </h4>
            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-850 text-xs text-slate-300 font-mono leading-relaxed">
              {activeRecipe.firmwareHint}
            </div>
          </div>

          {/* ID Handover Rule Reminder */}
          <div className="bg-cyan-950/30 border border-cyan-800/40 rounded-2xl p-4 text-xs text-slate-300 space-y-1.5">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Lab Head Verification Required
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Remember to attach your Student ID or Teacher ID during booking. When verified, the Lab Head displays a Handover QR which activates your loan countdown timer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
