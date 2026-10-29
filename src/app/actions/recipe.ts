'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeneratedRecipe {
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
  }[];
  wiringNotes: string[];
  firmwareHint: string;
}

export async function generateGeminiRecipeAction(userPrompt: string): Promise<{
  success: boolean;
  recipe?: GeneratedRecipe;
  isLiveGemini: boolean;
  error?: string;
}> {
  const prompt = (userPrompt || '').trim();
  if (!prompt) {
    return { success: false, isLiveGemini: false, error: 'Please enter a project concept or question.' };
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const systemPrompt = `You are the Scientific Chef, an embedded systems and electronics architect for university laboratories.
Given a student's project brief: "${prompt}", compose an authoritative, production-grade Bill of Materials (BOM) and circuit recipe.
Prefer standard components available in academia and on Amazon (e.g., Arduino Uno/Mega/Nano, ESP32, ESP8266, Raspberry Pi 4/Pico, HC-SR04, DHT22, BME280, MPU-6050, PIR, MQ gas sensors, NEMA 17, SG90, L298N, Fluke, Rigol).

Output MUST be a JSON object with this exact schema:
{
  "title": "string (concise project title)",
  "category": "string (e.g. IoT & Sensing, Robotics & Automation, Environmental, Wearable Biomedical)",
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "estDays": number (1 to 14),
  "estHours": number (0 to 23),
  "description": "string (clear 2-sentence summary of architecture and operation)",
  "requiredComponents": [
    {
      "name": "string (exact component name)",
      "category": "microcontrollers" | "sensors" | "single_board_computers" | "test_equipment" | "robotics" | "actuators_motors",
      "purpose": "string (exact functional role in circuit)"
    }
  ],
  "wiringNotes": [
    "string (step 1 wiring)",
    "string (step 2 wiring)",
    "string (step 3 wiring)"
  ],
  "firmwareHint": "string (architecture guidelines, key libraries, and C++/Python pin configurations)"
}`;

      const result = await model.generateContent(systemPrompt);
      const responseText = result.response.text();
      const parsed = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());

      return {
        success: true,
        isLiveGemini: true,
        recipe: {
          id: 'gemini-' + Date.now(),
          title: parsed.title || prompt.slice(0, 48),
          category: parsed.category || 'Embedded Systems',
          difficulty: ['Beginner', 'Intermediate', 'Advanced'].includes(parsed.difficulty) ? parsed.difficulty : 'Intermediate',
          estDays: Number(parsed.estDays) || 3,
          estHours: Number(parsed.estHours) || 0,
          description: parsed.description,
          requiredComponents: Array.isArray(parsed.requiredComponents) ? parsed.requiredComponents : [],
          wiringNotes: Array.isArray(parsed.wiringNotes) ? parsed.wiringNotes : [],
          firmwareHint: parsed.firmwareHint || 'PlatformIO / Arduino IDE with standard vendor driver libraries.',
        },
      };
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to embedded synthesizer:', err?.message);
    }
  }

  // Smart Embedded Synthesizer (Tailored dynamically to prompt keywords)
  const lower = prompt.toLowerCase();
  let title = prompt.slice(0, 48) + (prompt.length > 48 ? '...' : '');
  let category = 'IoT & Embedded Electronics';
  let difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate';
  let components: GeneratedRecipe['requiredComponents'] = [];
  let wiring: string[] = [];
  let firmware = 'PlatformIO with Arduino framework and FreeRTOS task scheduling.';

  if (lower.includes('water') || lower.includes('plant') || lower.includes('soil') || lower.includes('greenhouse') || lower.includes('agri')) {
    title = 'Automated Soil Moisture & Environmental Telemetry Rig';
    category = 'Smart Agriculture & IoT';
    difficulty = 'Beginner';
    components = [
      { name: 'ESP-32 NodeMCU Wi-Fi & Dual-Mode Bluetooth Board', category: 'microcontrollers', purpose: 'Core SoC with Wi-Fi telemetry and ADC calibration' },
      { name: 'Capacitive Soil Moisture Sensor v1.2', category: 'sensors', purpose: 'Corrosion-resistant volumetric soil water measurement' },
      { name: 'DHT22 / AM2302 High-Accuracy Digital Temp & Humidity', category: 'sensors', purpose: 'Atmospheric ambient condition monitoring' },
      { name: 'Fluke 117 True-RMS Electrician Digital Multimeter', category: 'test_equipment', purpose: 'Precision calibration of 3.3V analog rail' },
    ];
    wiring = [
      'Connect Capacitive Soil Sensor VCC to ESP32 3.3V, GND to common GND, and AOUT to GPIO 34 (ADC1_CH6).',
      'Connect DHT22 Data pin to GPIO 4 with a 10k pull-up resistor to 3.3V.',
      'Calibrate analog threshold with the multimeter by checking dry soil (2.8V) vs saturated soil (1.1V).',
    ];
    firmware = 'Use PubSubClient for lightweight MQTT telemetry publishing to AWS IoT Core or ThingsBoard.';
  } else if (lower.includes('robot') || lower.includes('motor') || lower.includes('line') || lower.includes('car') || lower.includes('obstacle') || lower.includes('drive')) {
    title = 'Autonomous Obstacle-Avoiding & Dual-Sensor Rover';
    category = 'Robotics & Mechatronics';
    difficulty = 'Intermediate';
    components = [
      { name: 'Arduino Mega 2560 R3 Microcontroller Board', category: 'microcontrollers', purpose: 'Dedicated real-time motion control and sonar interrupt handling' },
      { name: 'HC-SR04 Ultrasonic Distance Sensor Module', category: 'sensors', purpose: 'Front-facing obstacle echo range finding (2cm - 400cm)' },
      { name: 'TCRT5000 Dual Infrared Line Tracking Sensor', category: 'sensors', purpose: 'Floor boundary optical reflectance monitoring' },
      { name: '4WD Smart Robot Car Chassis Kit with L298N Driver', category: 'robotics', purpose: 'Dual H-bridge 4-wheel drive mechatronic platform' },
    ];
    wiring = [
      'Connect HC-SR04 Trigger to Arduino Pin 9, Echo to Pin 10 (5V logic).',
      'Connect TCRT5000 Digital Out to Pin 2 (External Interrupt INT0) for high-speed line boundary detection.',
      'Wire L298N dual H-bridge motor driver to Pins 4, 5, 6, 7 and ensure common ground with the battery supply.',
    ];
    firmware = 'Write a non-blocking state machine using millis() to poll sonar without pausing PWM motor drive.';
  } else if (lower.includes('heart') || lower.includes('health') || lower.includes('ecg') || lower.includes('pulse') || lower.includes('body')) {
    title = 'Wearable Vital Signs & PPG Biosensor Monitor';
    category = 'Biomedical & Healthcare';
    difficulty = 'Advanced';
    components = [
      { name: 'Raspberry Pi Pico W with Wi-Fi (RP2040)', category: 'microcontrollers', purpose: 'Low-noise 133MHz dual-core processing for biological signal acquisition' },
      { name: 'MAX30102 High-Sensitivity Pulse Oximeter & Heart-Rate Sensor', category: 'sensors', purpose: 'I2C optical photoplethysmogram (PPG) SpO2 acquisition' },
      { name: 'AD8232 Single-Lead Heart Rate / ECG Monitor Module', category: 'sensors', purpose: 'Analog front-end instrumentation amplifier for cardiac rhythm' },
      { name: 'Fluke 117 True-RMS Electrician Digital Multimeter', category: 'test_equipment', purpose: 'Verification of electrode reference potential and signal ground' },
    ];
    wiring = [
      'Connect MAX30102 SDA to Pico Pin 4 (I2C0 SDA) and SCL to Pin 5 (I2C0 SCL) with 4.7k pull-up resistors.',
      'Connect AD8232 Output to Pico ADC0 (Pin 31). Ensure RA and LA leads are twisted to cancel 50Hz mains hum.',
      'Power analog components from an isolated 3.3V battery supply to prevent power supply ripple artifacts.',
    ];
    firmware = 'Implement a real-time digital bandpass filter (0.5Hz - 40Hz) in C++ to isolate QRS cardiac complexes.';
  } else if (lower.includes('weather') || lower.includes('temp') || lower.includes('air') || lower.includes('gas') || lower.includes('smoke') || lower.includes('pollution')) {
    title = 'Industrial Air Quality & Micro-Climate Station';
    category = 'Environmental Engineering';
    difficulty = 'Intermediate';
    components = [
      { name: 'ESP-32 NodeMCU Wi-Fi & Dual-Mode Bluetooth Board', category: 'microcontrollers', purpose: 'High-speed dual-core processor with Wi-Fi HTTP / MQTT server' },
      { name: 'BME280 Precision Barometric Pressure & Humidity Sensor', category: 'sensors', purpose: 'Precision barometric altitude, temperature, and RH over I2C' },
      { name: 'MQ-135 Hazardous Air Quality & Hazardous Gas Sensor', category: 'sensors', purpose: 'Electrochemical detection of NH3, NOx, benzene, and smoke' },
      { name: 'DS18B20 Waterproof Stainless Steel Digital Temperature Probe', category: 'sensors', purpose: 'External weatherproof Dallas 1-Wire temperature reference' },
    ];
    wiring = [
      'Wire BME280 SDA to GPIO 21 and SCL to GPIO 22 on the ESP32 hardware I2C bus.',
      'Connect MQ-135 analog pin AO to GPIO 36 (ADC1_CH0). Pre-heat the sensor for 24 hours prior to calibration.',
      'Wire DS18B20 Data to GPIO 15 with a 4.7k pull-up resistor to 3.3V.',
    ];
    firmware = 'Sample sensors every 5 seconds, average over 1-minute windows, and upload JSON payloads over Wi-Fi.';
  } else {
    // General engineering synthesis
    title = `Embedded Solution: ${prompt.slice(0, 36)}`;
    category = 'Custom Electronics Prototype';
    difficulty = 'Intermediate';
    components = [
      { name: 'ESP-32 NodeMCU Wi-Fi & Dual-Mode Bluetooth Board', category: 'microcontrollers', purpose: 'Master controller for logic execution and wireless telemetry' },
      { name: 'HC-SR04 Ultrasonic Distance Sensor Module', category: 'sensors', purpose: 'Primary distance and proximity sensing channel' },
      { name: 'BME280 Precision Barometric Pressure & Humidity Sensor', category: 'sensors', purpose: 'Environmental feedback and thermal compensation' },
      { name: 'Korad KD3005D 30V 5A Adjustable Linear DC Bench Power Supply', category: 'test_equipment', purpose: 'Regulated clean laboratory DC power rail for circuit bring-up' },
    ];
    wiring = [
      'Step 1: Check power rail voltages with bench meter before connecting sensitive 3.3V logic lines.',
      'Step 2: Connect I2C SDA and SCL to microcontroller hardware bus pins with standard 4.7k pull-up resistors.',
      'Step 3: Ensure star-grounding topology so high-current returns do not inject ground bounce into sensor ADCs.',
    ];
    firmware = 'Structured Arduino C++ / MicroPython codebase featuring FreeRTOS cooperative task scheduling.';
  }

  return {
    success: true,
    isLiveGemini: false,
    recipe: {
      id: 'synth-' + Date.now(),
      title,
      category,
      difficulty,
      estDays: difficulty === 'Beginner' ? 2 : difficulty === 'Intermediate' ? 4 : 6,
      estHours: 0,
      description: `Synthesized design recipe for "${prompt}". Engineered for maximal reliability, noise immunity, and compatibility with standard laboratory hardware.`,
      requiredComponents: components,
      wiringNotes: wiring,
      firmwareHint: firmware,
    },
  };
}
