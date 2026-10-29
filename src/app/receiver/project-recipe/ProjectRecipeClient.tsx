'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Resource } from '@/types/database';
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
  Cpu,
  Filter,
  Bot,
  Compass,
} from 'lucide-react';

interface ProjectRecipeClientProps {
  resources: Resource[];
}

export interface RecipeTemplate {
  id: string;
  title: string;
  category: string;
  tag: 'IoT' | 'Robotics' | 'Biomedical' | 'Automation' | 'Test & Bench' | 'Environmental';
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

export const KNOWN_PROJECT_RECIPES: RecipeTemplate[] = [
  {
    id: 'smart-agri',
    title: 'Smart Agriculture & Automated Irrigation Rig',
    category: 'IoT & Environmental Sensing',
    tag: 'IoT',
    difficulty: 'Beginner',
    estDays: 3,
    estHours: 6,
    description: 'Autonomous micro-climate and soil moisture monitor with Wi-Fi telemetry and automated relay pump switching.',
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
    title: 'Autonomous 4WD Obstacle-Avoiding Rover',
    category: 'Robotics & Mechatronics',
    tag: 'Robotics',
    difficulty: 'Intermediate',
    estDays: 4,
    estHours: 0,
    description: 'Dual-mode chassis with ultrasonic range detection, dual IR line tracking arrays, and H-bridge motor driver.',
    requiredComponents: [
      { name: 'Arduino Mega 2560 R3 Microcontroller Board', category: 'microcontrollers', purpose: 'Core real-time processing and PWM drive' },
      { name: 'HC-SR04 Ultrasonic Distance Sensor Module', category: 'sensors', purpose: 'Non-contact sonar distance detection (2cm - 400cm)' },
      { name: 'L298N Dual H-Bridge DC Motor Driver Module', category: 'actuators_motors', purpose: 'Bidirectional DC motor speed and direction control' },
      { name: 'SG90 9g Micro Servo Motor (180 Degree Rotation)', category: 'actuators_motors', purpose: 'Pan-tilt turret to scan ultrasonic sensor left/right' },
    ],
    wiringNotes: [
      'Trigger pin to Arduino Digital 9, Echo pin to Digital 10 (handles 5V logic natively).',
      'L298N requires common ground: connect battery GND to both L298N GND and Arduino GND.',
      'Servo Signal pin to Pin 11 (PWM). Power servo from external 5V UBEC regulator to prevent brownouts.',
    ],
    firmwareHint: 'Implement a non-blocking state machine using millis() to sweep servo angles while measuring obstacle range.',
  },
  {
    id: 'weather-station',
    title: 'Micro-Climate Wi-Fi Weather Station',
    category: 'Environmental & IoT',
    tag: 'Environmental',
    difficulty: 'Intermediate',
    estDays: 3,
    estHours: 0,
    description: 'Multi-sensor meteorological rig monitoring barometric pressure, humidity, air quality index, and hazardous gas levels.',
    requiredComponents: [
      { name: 'ESP-32 NodeMCU Wi-Fi & Dual-Mode Bluetooth Board', category: 'microcontrollers', purpose: 'Dual-core MCU with built-in Wi-Fi and Bluetooth' },
      { name: 'BME280 Precision Barometric Pressure & Humidity Sensor', category: 'sensors', purpose: 'Accurate barometric, humidity, and temperature data' },
      { name: 'MQ-135 Hazardous Air Quality & Hazardous Gas Sensor', category: 'sensors', purpose: 'Electrochemical detection of NH3, NOx, and smoke' },
      { name: '0.96 inch I2C OLED Display Module (SSD1306 128x64)', category: 'passives_prototyping', purpose: 'Local graphical display of live telemetry' },
    ],
    wiringNotes: [
      'Wire BME280 SDA to GPIO 21 and SCL to GPIO 22 on the ESP32 hardware I2C bus.',
      'Connect OLED SDA/SCL in parallel on the same I2C bus with 4.7k pull-up resistors.',
      'Connect MQ-135 analog pin AO to GPIO 36 (ADC1_CH0). Pre-heat the sensor for 24 hours prior to calibration.',
    ],
    firmwareHint: 'Sample sensors every 5 seconds, compute rolling averages, and transmit telemetry via lightweight MQTT.',
  },
  {
    id: 'wearable-health',
    title: 'Wearable Pulse Oximeter & PPG Heart Rate Monitor',
    category: 'Biomedical & Edge Computing',
    tag: 'Biomedical',
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
    firmwareHint: 'Use C++ or MicroPython for real-time Butterworth bandpass filtering (0.5Hz - 40Hz) to isolate cardiac pulses.',
  },
  {
    id: 'rfid-access',
    title: 'RFID Attendance & Electronic Door Lock System',
    category: 'Access Control & Security',
    tag: 'Automation',
    difficulty: 'Beginner',
    estDays: 2,
    estHours: 12,
    description: 'Contactless badge access control system with authorized ID white-listing, LCD visual verification, and automated door servo release.',
    requiredComponents: [
      { name: 'Arduino Uno R3 Microcontroller Board', category: 'microcontrollers', purpose: 'Master controller for SPI badge polling and lock drive' },
      { name: 'RC522 RFID Card Reader & Key Fob Kit (13.56MHz)', category: 'sensors', purpose: 'NFC/RFID 13.56MHz contactless tag interrogation' },
      { name: '16x2 Character LCD Display with I2C Backpack (HD44780)', category: 'passives_prototyping', purpose: 'User greeting and access status display' },
      { name: 'SG90 9g Micro Servo Motor (180 Degree Rotation)', category: 'actuators_motors', purpose: 'Physical deadbolt actuation latch' },
    ],
    wiringNotes: [
      'Connect RC522 SPI pins: SDA to D10, SCK to D13, MOSI to D11, MISO to D12, and RST to D9.',
      'Beware: RC522 requires 3.3V VCC. Supplying 5V to VCC will destroy the MFRC522 IC.',
      'Wire LCD I2C backpack: SDA to A4, SCL to A5, VCC to 5V, GND to GND.',
    ],
    firmwareHint: 'Use MFRC522 library and check UID against an internal PROGMEM lookup table. Pulse servo for 3 seconds on authorization.',
  },
  {
    id: 'line-follower',
    title: 'High-Speed Dual-Sensor Line Tracking Robot',
    category: 'Robotics & Automation',
    tag: 'Robotics',
    difficulty: 'Beginner',
    estDays: 3,
    estHours: 0,
    description: 'Precision black-line boundary tracking rover using optical reflectance sensors and PID differential motor velocity correction.',
    requiredComponents: [
      { name: 'Arduino Nano V3.0 Mini Development Board', category: 'microcontrollers', purpose: 'Compact chassis-mounted processing controller' },
      { name: 'TCRT5000 Dual Infrared Line Tracking Sensor Module', category: 'sensors', purpose: 'Floor infrared optical reflectivity monitoring' },
      { name: 'L298N Dual H-Bridge DC Motor Driver Module', category: 'actuators_motors', purpose: 'Differential left/right wheel speed modulation' },
    ],
    wiringNotes: [
      'Connect TCRT5000 D0 pins to Arduino Digital 2 and 3 (supports hardware pin-change interrupts).',
      'Wire L298N IN1, IN2, IN3, IN4 to Digital 5, 6, 9, 10 for PWM forward/reverse modulation.',
      'Ensure battery ground is tied directly to Arduino GND and L298N power ground.',
    ],
    firmwareHint: 'Implement a proportional-derivative (PD) loop to minimize course tracking oscillations at high track velocities.',
  },
  {
    id: 'air-pollution',
    title: 'Hazardous Gas & Industrial Air Quality Monitor',
    category: 'Environmental & Safety',
    tag: 'Environmental',
    difficulty: 'Intermediate',
    estDays: 3,
    estHours: 8,
    description: 'Air quality safety terminal analyzing ammonia, benzene, smoke, and air particulates with audible threshold alarm.',
    requiredComponents: [
      { name: 'ESP8266 NodeMCU CP2102 Wi-Fi Module', category: 'microcontrollers', purpose: 'Lightweight IoT Wi-Fi web-server and alert dispatch' },
      { name: 'MQ-135 Hazardous Air Quality & Hazardous Gas Sensor', category: 'sensors', purpose: 'Electrochemical detection of hazardous gases' },
      { name: '16x2 Character LCD Display with I2C Backpack (HD44780)', category: 'passives_prototyping', purpose: 'Live PPM air quality index readouts' },
    ],
    wiringNotes: [
      'Connect MQ-135 analog pin A0 to ESP8266 A0 (Note: onboard voltage divider handles 0-3.3V).',
      'Connect LCD I2C SDA to D2 (GPIO 4) and SCL to D1 (GPIO 5).',
      'MQ-135 internal heater draws ~150mA; power its 5V rail directly from USB supply, not the 3.3V LDO.',
    ],
    firmwareHint: 'Calibrate clean air resistance (Ro) before deployment, and calculate gas concentration in PPM using logarithmic curve formulas.',
  },
  {
    id: 'pir-security',
    title: 'Wireless PIR Motion Security & Intruder Alarm',
    category: 'Home Automation & Security',
    tag: 'Automation',
    difficulty: 'Beginner',
    estDays: 2,
    estHours: 0,
    description: 'Passive infrared human presence detector with instant Telegram / Push notification dispatch and relay siren trigger.',
    requiredComponents: [
      { name: 'ESP-32 NodeMCU Wi-Fi & Dual-Mode Bluetooth Board', category: 'microcontrollers', purpose: 'Wi-Fi security gateway with low-power sleep mode' },
      { name: 'PIR Motion Sensor Module HC-SR501', category: 'sensors', purpose: 'Dual-element pyroelectric motion and infrared beam detection' },
      { name: '0.96 inch I2C OLED Display Module (SSD1306 128x64)', category: 'passives_prototyping', purpose: 'Armed / Disarmed system status display' },
    ],
    wiringNotes: [
      'Connect HC-SR501 VCC to 5V, GND to GND, and OUT to ESP32 GPIO 13.',
      'Adjust sensitivity and delay trimpots on the PIR board: set delay to minimum (~2s) for responsive micro-controller polling.',
      'Connect OLED SDA to GPIO 21 and SCL to GPIO 22.',
    ],
    firmwareHint: 'Configure ESP32 ext0 deep sleep wake-up on GPIO 13 HIGH level to run months on a single Li-ion cell.',
  },
  {
    id: 'gas-leak-detector',
    title: 'Smart Kitchen LPG & Smoke Leak Detector',
    category: 'Home Safety & Fire Detection',
    tag: 'IoT',
    difficulty: 'Beginner',
    estDays: 2,
    estHours: 12,
    description: 'Combustible gas alarm monitoring methane, propane, and butane with automatic solenoid shutoff trigger.',
    requiredComponents: [
      { name: 'Arduino Uno R3 Microcontroller Board', category: 'microcontrollers', purpose: 'Deterministic analog sampling and buzzer trigger' },
      { name: 'MQ-2 Flammable Gas & Smoke Sensor Module', category: 'sensors', purpose: 'Tin dioxide semiconductor sensor for LPG and smoke' },
      { name: '16x2 Character LCD Display with I2C Backpack (HD44780)', category: 'passives_prototyping', purpose: 'Concentration level and safety status message' },
    ],
    wiringNotes: [
      'Wire MQ-2 analog output to Arduino A0. Digital threshold pin can be connected to D3 for immediate interrupt.',
      'Wire LCD backpack SDA to A4 and SCL to A5 with 5V supply.',
      'Allow 2-minute preheating period at startup before arming the trigger threshold.',
    ],
    firmwareHint: 'Use rolling moving average over 64 analog samples to filter out thermal drift and prevent false alarms.',
  },
  {
    id: 'smart-parking',
    title: 'Ultrasonic Slot Distance & Smart Parking Rig',
    category: 'Smart Cities & Infrastructure',
    tag: 'Automation',
    difficulty: 'Beginner',
    estDays: 3,
    estHours: 0,
    description: 'Vehicle entry sensing gate with ultrasonic obstacle range detection and automated barrier arm servo positioning.',
    requiredComponents: [
      { name: 'Arduino Uno R3 Microcontroller Board', category: 'microcontrollers', purpose: 'Logic coordination and gate timing' },
      { name: 'HC-SR04 Ultrasonic Distance Sensor Module', category: 'sensors', purpose: 'Detects vehicle presence within parking bay (< 30cm)' },
      { name: 'SG90 9g Micro Servo Motor (180 Degree Rotation)', category: 'actuators_motors', purpose: 'Boom barrier gate raising and lowering' },
      { name: '16x2 Character LCD Display with I2C Backpack (HD44780)', category: 'passives_prototyping', purpose: 'Displays "SLOT AVAILABLE" or "SLOT FULL"' },
    ],
    wiringNotes: [
      'HC-SR04 Trig to Pin 7, Echo to Pin 8. VCC to 5V, GND to GND.',
      'Servo signal to Pin 9 (PWM). Connect a 100uF capacitor across servo VCC and GND.',
      'Wire LCD to A4 (SDA) and A5 (SCL).',
    ],
    firmwareHint: 'Smooth barrier motion by incrementing servo angles in 5-degree increments with 20ms delays instead of instant jumps.',
  },
  {
    id: 'spatial-mouse',
    title: '6-Axis IMU Spatial Motion & Gesture Controller',
    category: 'Human-Interface Devices (HID)',
    tag: 'Biomedical',
    difficulty: 'Intermediate',
    estDays: 3,
    estHours: 12,
    description: 'Wireless air-mouse and 3D gesture wand utilizing MEMS gyroscope and accelerometer with complementary attitude filtering.',
    requiredComponents: [
      { name: 'Raspberry Pi Pico W with Wi-Fi (RP2040)', category: 'microcontrollers', purpose: 'Native USB HID mouse and keyboard emulation' },
      { name: 'MPU-6050 6-Axis Gyroscope & Accelerometer Module', category: 'sensors', purpose: 'MEMS 3-axis angular rate and acceleration sensing' },
      { name: '0.96 inch I2C OLED Display Module (SSD1306 128x64)', category: 'passives_prototyping', purpose: 'Real-time pitch, roll, and yaw angles display' },
    ],
    wiringNotes: [
      'Connect MPU-6050 SDA to Pico Pin 4 (I2C0 SDA) and SCL to Pin 5 (I2C0 SCL).',
      'Connect INT pin to Pin 6 to handle 100Hz FIFO data-ready interrupts.',
      'Connect OLED in parallel on the same I2C bus.',
    ],
    firmwareHint: 'Use TinyUSB stack on RP2040 core 0 for USB HID reporting, and compute Madgwick quaternion attitude on core 1.',
  },
  {
    id: 'cnc-camera-slider',
    title: 'Precision Camera Slider & Motorized Rail',
    category: 'Mechatronics & Cinema Robotics',
    tag: 'Robotics',
    difficulty: 'Intermediate',
    estDays: 4,
    estHours: 0,
    description: 'Programmable linear motion rig for time-lapse photography with micro-stepping motor drive and acceleration S-curves.',
    requiredComponents: [
      { name: 'Arduino Uno R3 Microcontroller Board', category: 'microcontrollers', purpose: 'Deterministic pulse train generator' },
      { name: 'NEMA 17 Bipolar Stepper Motor (1.5A 42Ncm)', category: 'actuators_motors', purpose: 'High-torque precision linear positioning' },
      { name: 'TB6600 4A Stepper Motor Driver Controller', category: 'actuators_motors', purpose: 'Optocoupled industrial micro-stepping driver' },
      { name: 'Korad KD3005D 30V 5A Adjustable Linear DC Bench Power Supply', category: 'test_equipment', purpose: 'Clean 18V-24V stepper drive rail' },
    ],
    wiringNotes: [
      'Wire Arduino Pin 3 to TB6600 PUL+ and Pin 4 to DIR+. Connect PUL- and DIR- to Arduino GND.',
      'Connect NEMA 17 4-wire phases: Black/Green to A+/A-, Red/Blue to B+/B-.',
      'Set TB6600 DIP switches for 1/16 micro-stepping and 1.5A peak current limit.',
    ],
    firmwareHint: 'Use AccelStepper library with setAcceleration and setMaxSpeed to eliminate mechanical camera vibration.',
  },
  {
    id: 'digital-altimeter',
    title: 'Barometric Altimeter & Vertical Climb Rate Indicator',
    category: 'Avionics & High-Altitude Sensing',
    tag: 'Environmental',
    difficulty: 'Intermediate',
    estDays: 2,
    estHours: 18,
    description: 'Precision sub-meter atmospheric pressure and hypsometric altitude telemetry module for drone flight computers.',
    requiredComponents: [
      { name: 'STM32F103C8T6 ARM Cortex-M3 Blue Pill Development Board', category: 'microcontrollers', purpose: '72MHz ARM computing engine with hardware I2C' },
      { name: 'BMP280 Digital Barometric Pressure Sensor Module', category: 'sensors', purpose: 'Low-noise barometric pressure and thermal reference' },
      { name: '0.96 inch I2C OLED Display Module (SSD1306 128x64)', category: 'passives_prototyping', purpose: 'Vertical speed indicator (variometer) tape' },
    ],
    wiringNotes: [
      'Wire BMP280 SDA to STM32 PB7 and SCL to PB6 (hardware I2C1).',
      'Wire OLED to same bus. Both devices require 3.3V power from the Blue Pill 3V3 pin.',
      'Check solder jumper on BMP280 module: SDO tied to GND sets address 0x76; tied to VCC sets 0x77.',
    ],
    firmwareHint: 'Implement a 1D Kalman filter blending pressure measurements with altitude estimates to eliminate turbulent air noise.',
  },
  {
    id: 'vibration-seismic',
    title: 'Structural Seismic Vibration & Impact Monitor',
    category: 'Civil Infrastructure & Safety',
    tag: 'Environmental',
    difficulty: 'Intermediate',
    estDays: 3,
    estHours: 0,
    description: 'High-frequency vibration monitoring rig detecting machinery shock, bridge resonance, and seismic ground acceleration.',
    requiredComponents: [
      { name: 'Arduino Nano V3.0 Mini Development Board', category: 'microcontrollers', purpose: 'High-speed analog-to-digital sampling' },
      { name: 'SW-420 Vibration & Shock Sensor Module', category: 'sensors', purpose: 'Omnidirectional spring-roller vibration detection' },
      { name: 'MPU-6050 6-Axis Gyroscope & Accelerometer Module', category: 'sensors', purpose: 'Quantitative 3-axis G-force measurement (+/-16g)' },
      { name: '0.96 inch I2C OLED Display Module (SSD1306 128x64)', category: 'passives_prototyping', purpose: 'Peak G-force hold and waveform spectrogram' },
    ],
    wiringNotes: [
      'Connect SW-420 DO to Arduino Digital 2 (hardware interrupt INT0 for instant shock triggers).',
      'Connect MPU-6050 SDA to A4 and SCL to A5 with 4.7k pull-up resistors.',
      'Mount sensors rigidly to the testing specimen using industrial mounting tape to avoid damping high frequencies.',
    ],
    firmwareHint: 'Capture 256-point acceleration windows at 1kHz and compute Fast Fourier Transform (FFT) to identify resonant frequencies.',
  },
  {
    id: 'tof-laser-tape',
    title: 'Optical Time-of-Flight Millimeter Laser Rangefinder',
    category: 'Optical & Metrology',
    tag: 'Test & Bench',
    difficulty: 'Intermediate',
    estDays: 2,
    estHours: 12,
    description: 'Sub-millimeter accurate laser distance measure utilizing photon flight timing independent of target surface reflectivity.',
    requiredComponents: [
      { name: 'ESP-32 NodeMCU Wi-Fi & Dual-Mode Bluetooth Board', category: 'microcontrollers', purpose: 'Floating-point computation and Bluetooth BLE HID' },
      { name: 'VL53L0X Time-of-Flight (ToF) Laser Distance Ranging Sensor', category: 'sensors', purpose: '940nm VCSEL laser emitter and SPAD photon detector' },
      { name: '0.96 inch I2C OLED Display Module (SSD1306 128x64)', category: 'passives_prototyping', purpose: 'Millimeter distance and battery gauge readout' },
    ],
    wiringNotes: [
      'Connect VL53L0X VIN to 3.3V, GND to GND, SDA to GPIO 21, and SCL to GPIO 22.',
      'Wire XSHUT pin to GPIO 19 to allow hardware software power-down between measurements.',
      'Ensure the optical protective cover film is removed from the sensor face before testing.',
    ],
    firmwareHint: 'Configure high accuracy mode with a 200ms timing budget to achieve +/-1mm precision up to 2 meters range.',
  },
  {
    id: 'pan-tilt-turret',
    title: '2-Axis Sonar Tracking Pan-Tilt Turret',
    category: 'Robotics & Target Tracking',
    tag: 'Robotics',
    difficulty: 'Intermediate',
    estDays: 3,
    estHours: 12,
    description: 'Active scanning turret that locates nearest target in a 180-degree field of view and tracks its movement in real time.',
    requiredComponents: [
      { name: 'Arduino Uno R3 Microcontroller Board', category: 'microcontrollers', purpose: 'Real-time servo PID and sonar echo timing' },
      { name: 'HC-SR04 Ultrasonic Distance Sensor Module', category: 'sensors', purpose: 'Active sonar acoustic echo locator' },
      { name: 'MG996R High-Torque Metal Gear Digital Servo Motor', category: 'actuators_motors', purpose: 'Base yaw pan axis (10kg/cm torque)' },
      { name: 'SG90 9g Micro Servo Motor (180 Degree Rotation)', category: 'actuators_motors', purpose: 'Elevation tilt axis' },
    ],
    wiringNotes: [
      'Pan Servo (MG996R) signal to Arduino Pin 9; Tilt Servo (SG90) signal to Pin 10.',
      'Do NOT power the MG996R from the Arduino 5V header—it can draw over 1.5A under stall. Use external 6V supply.',
      'HC-SR04 Trig to Pin 11, Echo to Pin 12.',
    ],
    firmwareHint: 'Sweep yaw from 0 to 180, identify minimum distance index, then center yaw on target using a proportional tracking loop.',
  },
  {
    id: 'bench-power-station',
    title: 'Precision Programmable Bench Power Reference',
    category: 'Test & Calibration Instruments',
    tag: 'Test & Bench',
    difficulty: 'Advanced',
    estDays: 4,
    estHours: 0,
    description: 'Laboratory power bench calibration terminal verifying voltage regulation, current draw ripple, and thermal protection under load.',
    requiredComponents: [
      { name: 'STM32F103C8T6 ARM Cortex-M3 Blue Pill Development Board', category: 'microcontrollers', purpose: 'High-speed 12-bit ADC data acquisition and PWM duty control' },
      { name: 'Korad KD3005D 30V 5A Adjustable Linear DC Bench Power Supply', category: 'test_equipment', purpose: 'Ultra-low-noise regulated DC power source' },
      { name: 'Fluke 117 True-RMS Electrician Digital Multimeter', category: 'test_equipment', purpose: 'Calibration reference standard for true-RMS voltage and current' },
    ],
    wiringNotes: [
      'Connect power supply positive and negative binding posts through high-current 4mm banana cables.',
      'Wire STM32 ADC channels through an external 10:1 precision resistor voltage divider (0.1% tolerance).',
      'Use star grounding at the supply negative terminal to eliminate voltage drops along the return path.',
    ],
    firmwareHint: 'Implement over-current protection (OCP) interrupt that disconnects load within 50 microseconds of threshold violation.',
  },
  {
    id: 'high-speed-logic-analyzer',
    title: '100MHz Dual-Channel Logic Analyzer & Signal Sniffer',
    category: 'Test & Diagnostic Instrumentation',
    tag: 'Test & Bench',
    difficulty: 'Advanced',
    estDays: 5,
    estHours: 0,
    description: 'Hardware protocol decoder and digital bus sniffer for decoding SPI, I2C, and UART signals with laboratory oscilloscope verification.',
    requiredComponents: [
      { name: 'Raspberry Pi Pico W with Wi-Fi (RP2040)', category: 'microcontrollers', purpose: 'PIO (Programmable I/O) state machines capturing logic up to 100MHz' },
      { name: 'Rigol DS1054Z 50MHz 4-Channel Digital Storage Oscilloscope', category: 'test_equipment', purpose: 'Waveform rise-time, overshoot, and ringing verification' },
      { name: 'Siglent SDG1032X 30MHz Arbitrary Function Generator', category: 'test_equipment', purpose: 'Precision clock and test bus signal generation' },
    ],
    wiringNotes: [
      'Connect Pico GPIO 2 through GPIO 9 to the digital test bus lines.',
      'Attach Rigol Scope Channel 1 probe with ground spring directly to clock line for impedance-matched measurement.',
      'Feed reference square wave from Siglent generator into Pico GPIO 2 to verify capture trigger timing.',
    ],
    firmwareHint: 'Load sigrok/PulseView compatible firmware onto the RP2040 utilizing dual DMA channels to stream raw byte streams over USB.',
  },
  {
    id: 'edge-vision-cam',
    title: 'Embedded Linux Computer Vision & Object Classifier',
    category: 'Edge AI & Single-Board Computing',
    tag: 'Single-Board & Linux' as any,
    difficulty: 'Advanced',
    estDays: 5,
    estHours: 0,
    description: 'Autonomous edge vision node running lightweight TensorFlow Lite classifiers and real-time video pipeline on Linux.',
    requiredComponents: [
      { name: 'Raspberry Pi 4 Model B (4GB RAM)', category: 'single_board_computers', purpose: 'Quad-core Cortex-A72 Linux computer running OpenCV pipeline' },
      { name: 'Fluke 117 True-RMS Electrician Digital Multimeter', category: 'test_equipment', purpose: 'Verification of 5.1V 3A power rail stability under CPU load' },
      { name: '0.96 inch I2C OLED Display Module (SSD1306 128x64)', category: 'passives_prototyping', purpose: 'Displays IP address, CPU temperature, and FPS counter' },
    ],
    wiringNotes: [
      'Connect Pi 4 official 5V 3A USB-C power adapter. Measure voltage between GPIO Pin 2 (5V) and Pin 6 (GND) with Fluke meter.',
      'Connect OLED to GPIO 2 (SDA) and GPIO 3 (SCL), 3.3V and GND.',
      'Ensure active cooling fan is attached to prevent thermal throttling at 80°C.',
    ],
    firmwareHint: 'Use Python 3 with TFLite runtime and OpenCV to capture video frames, crop bounding boxes, and infer classifications under 45ms.',
  },
  {
    id: 'solar-tracker',
    title: 'Dual-Axis Autonomous Solar Tracking Rig',
    category: 'Renewable Energy & Robotics',
    tag: 'Automation',
    difficulty: 'Intermediate',
    estDays: 3,
    estHours: 18,
    description: 'Active photovoltaic orienting platform using light-dependent differential sensing to maximize solar power absorption by 35%.',
    requiredComponents: [
      { name: 'Arduino Uno R3 Microcontroller Board', category: 'microcontrollers', purpose: 'Sun vector computation and dual-axis servo positioning' },
      { name: 'MG996R High-Torque Metal Gear Digital Servo Motor', category: 'actuators_motors', purpose: 'Base horizontal azimuth rotation axis' },
      { name: 'SG90 9g Micro Servo Motor (180 Degree Rotation)', category: 'actuators_motors', purpose: 'Vertical altitude tilt axis' },
      { name: 'Korad KD3005D 30V 5A Adjustable Linear DC Bench Power Supply', category: 'test_equipment', purpose: 'Clean regulated servo power testing rail' },
    ],
    wiringNotes: [
      'Azimuth Servo to Pin 9, Altitude Servo to Pin 10 on Arduino.',
      'Connect 4 LDR sensors (Top-Left, Top-Right, Bottom-Left, Bottom-Right) to analog pins A0-A3 with 10k divider resistors.',
      'Power servos from Korad DC supply set to 5.5V; connect supply GND to Arduino GND.',
    ],
    firmwareHint: 'Compute differential error between (Top - Bottom) and (Left - Right) averages; drive servos until error falls within deadband.',
  },
  {
    id: 'mesh-greenhouse',
    title: 'Multi-Node Environmental Telemetry Network',
    category: 'Distributed Wireless Mesh',
    tag: 'IoT',
    difficulty: 'Advanced',
    estDays: 4,
    estHours: 12,
    description: 'Decentralized wireless sensor mesh collecting multi-zone soil and canopy micro-climates across large academic facilities.',
    requiredComponents: [
      { name: 'ESP-32 NodeMCU Wi-Fi & Dual-Mode Bluetooth Board', category: 'microcontrollers', purpose: 'Root mesh gateway node with cloud bridge' },
      { name: 'ESP8266 NodeMCU CP2102 Wi-Fi Module', category: 'microcontrollers', purpose: 'Satellite remote sensor node' },
      { name: 'DHT22 / AM2302 High-Accuracy Digital Temp & Humidity Sensor', category: 'sensors', purpose: 'High-precision micro-climate sampling' },
      { name: 'BME280 Precision Barometric Pressure & Humidity Sensor', category: 'sensors', purpose: 'Atmospheric pressure gradient reference' },
    ],
    wiringNotes: [
      'Node A (ESP32): Wire BME280 to GPIO 21/22 and connect to Wi-Fi router.',
      'Node B (ESP8266): Wire DHT22 Data to D4 with 4.7k pull-up resistor.',
      'Configure painlessMesh protocol on both nodes with identical SSID and password mesh credentials.',
    ],
    firmwareHint: 'Broadcast JSON packets across painlessMesh network every 10 seconds; root node bridges messages to MQTT broker.',
  },
  {
    id: 'rfid-inventory-scanner',
    title: 'Automated Tool & Component Checkout Scanner',
    category: 'Inventory Management Systems',
    tag: 'Automation',
    difficulty: 'Intermediate',
    estDays: 2,
    estHours: 18,
    description: 'Hardware checkout terminal reading asset tag cards and automatically updating local inventory counts on an alphanumeric screen.',
    requiredComponents: [
      { name: 'Arduino Uno R3 Microcontroller Board', category: 'microcontrollers', purpose: 'Master reader polling and serial ledger output' },
      { name: 'RC522 RFID Card Reader & Key Fob Kit (13.56MHz)', category: 'sensors', purpose: 'Contactless asset tag and ID badge interrogation' },
      { name: '16x2 Character LCD Display with I2C Backpack (HD44780)', category: 'passives_prototyping', purpose: 'Instant checkout confirmation and borrower feedback' },
    ],
    wiringNotes: [
      'RC522 VCC to 3.3V, GND to GND, RST to D9, SDA (SS) to D10, MOSI to D11, MISO to D12, SCK to D13.',
      'LCD Backpack: VCC to 5V, GND to GND, SDA to A4, SCL to A5.',
      'Optional piezo buzzer on Pin 6 for audible confirmation beep on tag detection.',
    ],
    firmwareHint: 'When valid UID is scanned, emit JSON string over Serial at 115200 baud: {"event":"checkout","tag":"..."}',
  },
  {
    id: 'teensy-audio-synth',
    title: 'Real-Time Polyphonic DSP Audio Synthesizer',
    category: 'Digital Signal Processing (DSP)',
    tag: 'Test & Bench',
    difficulty: 'Advanced',
    estDays: 4,
    estHours: 0,
    description: 'Low-latency digital sound synthesizer generating multi-waveform oscillators, state-variable filters, and envelope generators.',
    requiredComponents: [
      { name: 'Teensy 4.0 High-Performance 600MHz Microcontroller', category: 'microcontrollers', purpose: '600MHz ARM Cortex-M7 computing DSP audio blocks' },
      { name: '0.96 inch I2C OLED Display Module (SSD1306 128x64)', category: 'passives_prototyping', purpose: 'Oscillator waveform and ADSR envelope visualizer' },
      { name: 'Siglent SDG1032X 30MHz Arbitrary Function Generator', category: 'test_equipment', purpose: 'Audio input modulation source' },
    ],
    wiringNotes: [
      'Connect I2C OLED: SDA to Teensy Pin 18, SCL to Pin 19, 3.3V to 3.3V, GND to GND.',
      'Wire audio PWM or I2S DAC output from Teensy Pin 7 & 8 to headphone amplifier circuit.',
      'Use isolated audio ground to prevent USB power digital noise from entering the analog listening stage.',
    ],
    firmwareHint: 'Utilize the Teensy Audio Library graphical system design tool with AudioPlayMemory, AudioFilterStateVariable, and AudioOutputI2S.',
  },
  {
    id: 'capacitive-soil-telemetry',
    title: 'Corrosion-Resistant Soil Water Potential Logger',
    category: 'Agronomy & Precision Agriculture',
    tag: 'Environmental',
    difficulty: 'Beginner',
    estDays: 2,
    estHours: 12,
    description: 'Long-term submerged soil probe utilizing 555-timer capacitive frequency modulation to prevent copper corrosion.',
    requiredComponents: [
      { name: 'Arduino Nano V3.0 Mini Development Board', category: 'microcontrollers', purpose: 'Analog calibration and low-power sleep' },
      { name: 'Capacitive Soil Moisture Sensor v1.2', category: 'sensors', purpose: 'Corrosion-free capacitive dielectric permittivity probe' },
      { name: '16x2 Character LCD Display with I2C Backpack (HD44780)', category: 'passives_prototyping', purpose: 'Volumetric water content percentage readout' },
    ],
    wiringNotes: [
      'Connect sensor VCC to Arduino Pin 7 (powers sensor ONLY when measuring to extend sensor life).',
      'Connect sensor AOUT to Arduino A0; GND to GND.',
      'Connect LCD I2C SDA to A4, SCL to A5.',
    ],
    firmwareHint: 'Turn Pin 7 HIGH, wait 15ms for capacitive circuit stabilization, read A0, and set Pin 7 LOW before sleeping.',
  },
];

export function ProjectRecipeClient({ resources }: ProjectRecipeClientProps) {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(KNOWN_PROJECT_RECIPES[0].id);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const categories = useMemo(() => {
    return [
      { id: 'all', label: 'All Recipes', count: KNOWN_PROJECT_RECIPES.length },
      { id: 'IoT', label: 'IoT & Telemetry', count: KNOWN_PROJECT_RECIPES.filter((r) => r.tag === 'IoT').length },
      { id: 'Robotics', label: 'Robotics & Rovers', count: KNOWN_PROJECT_RECIPES.filter((r) => r.tag === 'Robotics').length },
      { id: 'Environmental', label: 'Environmental Sensing', count: KNOWN_PROJECT_RECIPES.filter((r) => r.tag === 'Environmental').length },
      { id: 'Automation', label: 'Smart Automation', count: KNOWN_PROJECT_RECIPES.filter((r) => r.tag === 'Automation').length },
      { id: 'Biomedical', label: 'Biomedical & Wearables', count: KNOWN_PROJECT_RECIPES.filter((r) => r.tag === 'Biomedical').length },
      { id: 'Test & Bench', label: 'Test & Instruments', count: KNOWN_PROJECT_RECIPES.filter((r) => r.tag === 'Test & Bench').length },
    ];
  }, []);

  const filteredRecipes = useMemo(() => {
    if (selectedCategoryFilter === 'all') return KNOWN_PROJECT_RECIPES;
    return KNOWN_PROJECT_RECIPES.filter((r) => r.tag === selectedCategoryFilter);
  }, [selectedCategoryFilter]);

  const activeRecipe = KNOWN_PROJECT_RECIPES.find((r) => r.id === selectedRecipeId) || KNOWN_PROJECT_RECIPES[0];

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
      if (compNameLower.includes('stm32') || compNameLower.includes('blue pill')) {
        return rNameLower.includes('stm32') || rNameLower.includes('blue pill');
      }
      if (compNameLower.includes('teensy')) {
        return rNameLower.includes('teensy');
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
      if (compNameLower.includes('capacitive soil')) {
        return rNameLower.includes('capacitive soil');
      }
      if (compNameLower.includes('soil')) {
        return rNameLower.includes('soil');
      }
      if (compNameLower.includes('l298n')) {
        return rNameLower.includes('l298n');
      }
      if (compNameLower.includes('tb6600')) {
        return rNameLower.includes('tb6600');
      }
      if (compNameLower.includes('nema 17') || compNameLower.includes('stepper motor')) {
        return rNameLower.includes('nema 17') || rNameLower.includes('stepper');
      }
      if (compNameLower.includes('sg90')) {
        return rNameLower.includes('sg90');
      }
      if (compNameLower.includes('mg996r')) {
        return rNameLower.includes('mg996r');
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
      if (compNameLower.includes('siglent') || compNameLower.includes('generator')) {
        return rNameLower.includes('siglent') || rNameLower.includes('generator');
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
      if (compNameLower.includes('mq-135') || compNameLower.includes('hazardous gas')) {
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
      if (compNameLower.includes('max30102') || compNameLower.includes('pulse oximeter')) {
        return rNameLower.includes('max30102');
      }
      if (compNameLower.includes('vl53l0x') || compNameLower.includes('laser')) {
        return rNameLower.includes('vl53l0x');
      }
      if (compNameLower.includes('tcrt5000') || compNameLower.includes('line tracking')) {
        return rNameLower.includes('tcrt5000');
      }
      if (compNameLower.includes('sw-420') || compNameLower.includes('vibration')) {
        return rNameLower.includes('sw-420');
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

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs uppercase tracking-wider mb-2">
          <Bot className="w-4 h-4 text-cyan-400" />
          <span>Scientific Chef Curated Laboratory Recipes</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Choose from 24 Pre-Verified Electronics Recipes
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Select an academic project build below. Each recipe provides an verified Bill of Materials matched in real time against inventory across Apex, Vanguard, and Horizon labs, along with pinout schematics and starter firmware.
        </p>

        {/* Category Filter Pills */}
        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-teal-500 text-neutral-950 font-bold shadow-sm'
                    : 'bg-neutral-950 text-slate-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-neutral-900 text-teal-300' : 'bg-neutral-800 text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recipes Grid Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" /> Catalog of Engineering Builds ({filteredRecipes.length})
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Click any card to inspect circuit architecture
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredRecipes.map((recipe) => {
            const isSelected = selectedRecipeId === recipe.id;
            return (
              <button
                key={recipe.id}
                type="button"
                onClick={() => setSelectedRecipeId(recipe.id)}
                className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-neutral-900 border-teal-500/80 ring-1 ring-teal-500/40 shadow-lg shadow-teal-950/20'
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
                    {isSelected ? 'Active Selection' : 'Select'}
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
                      #{idx + 1}
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
                      <span className="text-[11px] text-slate-400">Standard lab consumable</span>
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

            {/* Availability Summary & Quick Action */}
            <div className="mt-6 pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                {allAvailable ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> All recipe components are currently in stock across partner labs.
                  </span>
                ) : (
                  <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Some components are currently out on loan. Waitlist reservation available.
                  </span>
                )}
              </div>

              {componentsWithInventory[0]?.inventoryItem && (
                <Link
                  href={`/resources/${componentsWithInventory[0].inventoryItem.id}`}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Zap className="w-4 h-4" /> Borrow Primary Component ({componentsWithInventory[0].inventoryItem.name.slice(0, 24)}...)
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
              <Zap className="w-4 h-4" /> Starter Code &amp; Architecture Hint
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
