'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Resource } from '@/types/database';
import { generateGeminiRecipeAction } from '@/app/actions/recipe';
import {
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Zap,
  Code2,
  Check,
  Send,
  Loader2,
  Cpu,
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
  isLiveGemini?: boolean;
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
      { name: 'ESP-32 NodeMCU Wi-Fi & Dual-Mode Bluetooth Board', category: 'microcontrollers', purpose: 'Main MCU with MQTT & Wi-Fi' },
      { name: 'DHT11 Temperature & Humidity Sensor Module', category: 'sensors', purpose: 'Ambient atmospheric sensing' },
      { name: 'Capacitive Soil Moisture Sensor v1.2', category: 'sensors', purpose: 'Volumetric soil water content measurement' },
      { name: '5V Single-Channel Relay Module', category: 'actuators_motors', purpose: 'Low-voltage trigger for 12V submersible pump' },
    ],
    wiringNotes: [
      'Connect DHT11 VCC to 3.3V, GND to GND, and DATA pin to GPIO 4 with a 10k pull-up resistor.',
      'Connect Soil Moisture Analog Out (AOUT) to ESP32 ADC1 (GPIO 34) for 12-bit ADC reading.',
      'Connect Relay Control IN to GPIO 26. Use optocoupled isolation to prevent back-EMF spikes.',
    ],
    firmwareHint: 'PlatformIO / Arduino C++ with PubSubClient for AWS IoT or ThingsBoard telemetry dashboard.',
  },
  {
    id: 'obstacle-robot',
    title: 'Autonomous Obstacle-Avoiding Rover Chassis',
    category: 'Robotics & Mechatronics',
    difficulty: 'Intermediate',
    estDays: 4,
    estHours: 0,
    description: 'Dual-mode chassis with ultrasonic range detection, dual IR line tracking arrays, and H-bridge motor driver.',
    requiredComponents: [
      { name: 'Arduino Mega 2560 R3 Microcontroller Board', category: 'microcontrollers', purpose: 'Core real-time processing and PWM drive' },
      { name: 'HC-SR04 Ultrasonic Distance Sensor Module', category: 'sensors', purpose: 'Non-contact sonar distance detection (2cm - 400cm)' },
      { name: 'L298N Dual H-Bridge DC Motor Driver Module', category: 'actuators_motors', purpose: 'Bidirectional DC motor speed and direction control' },
      { name: 'TCRT5000 Dual Infrared Line Tracking Sensor', category: 'sensors', purpose: 'Floor boundary optical reflectance monitoring' },
    ],
    wiringNotes: [
      'Trigger pin to Arduino Digital 9, Echo pin to Digital 10 (handles 5V logic natively).',
      'L298N requires common ground: connect battery GND to both L298N GND and Arduino GND.',
      'Enable A (ENA) to Pin 5 (PWM), Enable B (ENB) to Pin 6 (PWM) for speed profiling.',
    ],
    firmwareHint: 'Implement a non-blocking state machine using millis() to avoid delay() pauses during obstacle scanning.',
  },
  {
    id: 'wearable-health',
    title: 'Wearable ECG & Wireless Pulse Oximeter',
    category: 'Biomedical & Edge Computing',
    difficulty: 'Advanced',
    estDays: 5,
    estHours: 12,
    description: 'Low-noise biomedical signal acquisition module with digital pulse plethysmography and real-time OLED rendering.',
    requiredComponents: [
      { name: 'Raspberry Pi Pico W with Wi-Fi (RP2040)', category: 'microcontrollers', purpose: 'Low-power dual-core processor for biosignal acquisition' },
      { name: 'MAX30102 High-Sensitivity Pulse Oximeter & Heart-Rate Sensor', category: 'sensors', purpose: 'I2C optical photoplethysmogram (PPG) SpO2 acquisition' },
      { name: '0.96 inch I2C OLED Display Module (SSD1306 128x64)', category: 'passives_prototyping', purpose: 'Local graph and metric rendering' },
      { name: 'Fluke 117 True-RMS Electrician Digital Multimeter', category: 'test_equipment', purpose: 'Verification of electrode reference potential and signal ground' },
    ],
    wiringNotes: [
      'Power the sensor analog front-end from an isolated 3.3V LDO rail to minimize mains 50Hz hum.',
      'Keep electrode lead wires twisted to reduce common-mode electromagnetic pickup.',
      'Connect OLED and MAX30102 to separate I2C buses or distinct addresses (0x3C and 0x57).',
    ],
    firmwareHint: 'Use C++ or MicroPython for real-time Butterworth bandpass filtering (0.5Hz - 40Hz).',
  },
  {
    id: 'weather-station',
    title: 'Micro-Climate Environmental Station & Air Quality',
    category: 'Environmental & IoT',
    difficulty: 'Intermediate',
    estDays: 3,
    estHours: 0,
    description: 'Multi-sensor meteorological rig monitoring barometric pressure, humidity, air quality index, and hazardous gas levels.',
    requiredComponents: [
      { name: 'ESP-32 NodeMCU Wi-Fi & Dual-Mode Bluetooth Board', category: 'microcontrollers', purpose: 'Dual-core MCU with built-in Wi-Fi and Bluetooth' },
      { name: 'BME280 Precision Barometric Pressure & Humidity Sensor', category: 'sensors', purpose: 'Accurate barometric, humidity, and temperature data' },
      { name: 'MQ-135 Hazardous Air Quality & Hazardous Gas Sensor', category: 'sensors', purpose: 'Electrochemical detection of NH3, NOx, and smoke' },
    ],
    wiringNotes: [
      'Wire BME280 SDA to GPIO 21 and SCL to GPIO 22 on the ESP32 hardware I2C bus.',
      'Connect MQ-135 analog pin AO to GPIO 36 (ADC1_CH0). Pre-heat the sensor for 24 hours prior to calibration.',
      'Add 4.7k pull-up resistors on both I2C data lines.',
    ],
    firmwareHint: 'Sample sensors every 5 seconds, compute rolling averages, and transmit telemetry via lightweight MQTT.',
  },
];

export function ProjectRecipeClient({ resources }: ProjectRecipeClientProps) {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(PRESET_RECIPES[0].id);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customRecipe, setCustomRecipe] = useState<RecipeTemplate | null>(null);

  const activeRecipe = customRecipe || PRESET_RECIPES.find((r) => r.id === selectedRecipeId) || PRESET_RECIPES[0];

  // Match required components with actual database inventory across institutions
  const componentsWithInventory = activeRecipe.requiredComponents.map((comp) => {
    const compNameLower = comp.name.toLowerCase();

    const matched = resources.find((r) => {
      const rNameLower = r.name.toLowerCase();

      // Specific hardware matching
      if (compNameLower.includes('esp-32') || compNameLower.includes('esp32')) {
        return rNameLower.includes('esp-32') || rNameLower.includes('esp32');
      }
      if (compNameLower.includes('esp8266')) {
        return rNameLower.includes('esp8266');
      }
      if (compNameLower.includes('uno')) {
        return rNameLower.includes('uno');
      }
      if (compNameLower.includes('mega')) {
        return rNameLower.includes('mega');
      }
      if (compNameLower.includes('nano')) {
        return rNameLower.includes('nano');
      }
      if (compNameLower.includes('pico')) {
        return rNameLower.includes('pico');
      }
      if (compNameLower.includes('raspberry pi 4') || compNameLower.includes('rpi 4')) {
        return rNameLower.includes('raspberry pi 4');
      }
      if (compNameLower.includes('pi zero') || compNameLower.includes('raspberry pi zero')) {
        return rNameLower.includes('pi zero');
      }
      if (compNameLower.includes('dht11')) {
        return rNameLower.includes('dht11');
      }
      if (compNameLower.includes('dht22')) {
        return rNameLower.includes('dht22');
      }
      if (compNameLower.includes('bme280')) {
        return rNameLower.includes('bme280');
      }
      if (compNameLower.includes('bmp280')) {
        return rNameLower.includes('bmp280');
      }
      if (compNameLower.includes('ultrasonic') || compNameLower.includes('hc-sr04')) {
        return rNameLower.includes('hc-sr04') || rNameLower.includes('ultrasonic');
      }
      if (compNameLower.includes('soil')) {
        return rNameLower.includes('soil');
      }
      if (compNameLower.includes('l298n')) {
        return rNameLower.includes('l298n');
      }
      if (compNameLower.includes('servo') || compNameLower.includes('sg90')) {
        return rNameLower.includes('sg90') || rNameLower.includes('servo');
      }
      if (compNameLower.includes('fluke') || compNameLower.includes('multimeter')) {
        return rNameLower.includes('fluke') || rNameLower.includes('multimeter');
      }
      if (compNameLower.includes('oscilloscope') || compNameLower.includes('rigol')) {
        return rNameLower.includes('rigol') || rNameLower.includes('oscilloscope');
      }
      if (compNameLower.includes('power supply') || compNameLower.includes('korad')) {
        return rNameLower.includes('korad') || rNameLower.includes('power supply');
      }
      if (compNameLower.includes('mpu-6050') || compNameLower.includes('gyro')) {
        return rNameLower.includes('mpu-6050');
      }
      if (compNameLower.includes('pir') || compNameLower.includes('motion')) {
        return rNameLower.includes('pir');
      }
      if (compNameLower.includes('mq-2') || compNameLower.includes('smoke')) {
        return rNameLower.includes('mq-2');
      }
      if (compNameLower.includes('mq-135') || compNameLower.includes('gas') || compNameLower.includes('air quality')) {
        return rNameLower.includes('mq-135');
      }
      if (compNameLower.includes('rc522') || compNameLower.includes('rfid')) {
        return rNameLower.includes('rc522') || rNameLower.includes('rfid');
      }
      if (compNameLower.includes('oled') || compNameLower.includes('ssd1306')) {
        return rNameLower.includes('oled');
      }
      if (compNameLower.includes('lcd')) {
        return rNameLower.includes('lcd');
      }
      if (compNameLower.includes('max30102') || compNameLower.includes('pulse') || compNameLower.includes('oximeter')) {
        return rNameLower.includes('max30102');
      }
      if (compNameLower.includes('tcrt5000') || compNameLower.includes('line tracking')) {
        return rNameLower.includes('tcrt5000');
      }

      // Keyword token fallback
      const tokens = compNameLower.split(/[\s-]+/).filter((w) => w.length > 3);
      const matchCount = tokens.filter((t) => rNameLower.includes(t)).length;
      return matchCount >= 1;
    });

    return {
      ...comp,
      inventoryItem: matched,
      isAvailable: Boolean(matched && (matched.available_quantity ?? 0) > 0),
    };
  });

  const allAvailable = componentsWithInventory.every((c) => c.isAvailable);

  const handleGenerateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const result = await generateGeminiRecipeAction(customPrompt);
      if (result.success && result.recipe) {
        setCustomRecipe({
          ...result.recipe,
          isLiveGemini: result.isLiveGemini,
        });
      }
    } catch (err) {
      console.error('Recipe generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search / Prompt Generator Header */}
      <div className="relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Scientific Chef Recipe Generator</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          What would you like to build?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Powered by Google Gemini to produce an engineering Bill of Materials, step-by-step pinout wiring instructions, and cross-lab stock availability.
        </p>

        <form onSubmit={handleGenerateCustom} className="mt-5 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g. Automated greenhouse with soil moisture, DHT11, and relay water valve..."
            className="flex-1 bg-neutral-950 border border-neutral-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 transition"
          />
          <button
            type="submit"
            disabled={isGenerating || !customPrompt.trim()}
            className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-neutral-950 font-bold text-xs transition flex items-center justify-center gap-2 shrink-0 shadow-sm"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{isGenerating ? 'Synthesizing with Gemini...' : 'Generate Recipe'}</span>
          </button>
        </form>

        {customRecipe && (
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              {customRecipe.isLiveGemini
                ? 'Generated via Google Gemini 1.5 Flash'
                : 'Generated via Lab Engineering Synthesizer'}
            </span>
          </div>
        )}
      </div>

      {/* Preset Recipe Selector Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" /> Curated Academic Recipes
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
                    ? 'bg-neutral-900 border-teal-500/80 ring-1 ring-teal-500/30'
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-neutral-800 text-slate-300">
                      {recipe.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-teal-400">
                      ~{recipe.estDays}d loan
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs leading-snug">{recipe.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{recipe.description}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{recipe.requiredComponents.length} components</span>
                  <span className={isSelected ? 'text-teal-400 font-bold' : ''}>
                    {isSelected ? 'Active' : 'Select'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Recipe Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Components & Inventory Status */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-800 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                  {activeRecipe.category}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{activeRecipe.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-lg font-medium bg-neutral-800 text-slate-300 border border-neutral-700">
                  Loan Duration: {activeRecipe.estDays} Days
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">{activeRecipe.description}</p>

            {/* Bill of Materials Table */}
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-teal-400" /> Required Bill of Materials &amp; Real-Time Stock
            </h4>

            <div className="space-y-2.5">
              {componentsWithInventory.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{comp.name}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-slate-400">
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
                      <span className="text-[11px] text-slate-400">Standard lab component</span>
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

            {/* Availability Summary */}
            <div className="mt-6 pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                {allAvailable ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> All recipe components are currently available across partner labs.
                  </span>
                ) : (
                  <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Some components are currently out on loan.
                  </span>
                )}
              </div>

              {componentsWithInventory[0]?.inventoryItem && (
                <Link
                  href={`/resources/${componentsWithInventory[0].inventoryItem.id}`}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" /> Borrow Primary Component
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Pin-to-Pin Schematic & Firmware Notes */}
        <div className="space-y-6">
          {/* Schematic Pin Notes */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Code2 className="w-4 h-4" /> Pinout &amp; Wiring Instructions
            </h4>
            <ul className="space-y-2.5">
              {activeRecipe.wiringNotes.map((note, idx) => (
                <li key={idx} className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                  <span className="w-4 h-4 rounded bg-teal-950 text-teal-400 border border-teal-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Firmware & Protocol Hint */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Starter Code &amp; Firmware Hint
            </h4>
            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800/80 text-xs text-slate-300 font-mono leading-relaxed">
              {activeRecipe.firmwareHint}
            </div>
          </div>

          {/* Verification Reminder */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 text-xs text-slate-300 space-y-1.5">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> Physical ID Verification
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Attach your Student or Faculty ID card when requesting equipment. Upon pickup, the Lab Custodian verifies your ID and provides a Handover QR to initiate the countdown timer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
