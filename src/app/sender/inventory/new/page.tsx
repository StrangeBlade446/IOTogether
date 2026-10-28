'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createResourceAction } from '@/app/actions/inventory';
import { Resource, ResourceCategory } from '@/types/database';
import {
  Package,
  PlusCircle,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

const PHOTO_PRESETS = [
  {
    label: 'Arduino Uno R3',
    url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=600&q=80',
    category: 'microcontrollers' as ResourceCategory,
  },
  {
    label: 'Raspberry Pi 4',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    category: 'single_board_computers' as ResourceCategory,
  },
  {
    label: 'ESP32 Wi-Fi NodeMCU',
    url: 'https://images.unsplash.com/photo-1608555817751-494b55dd4ebb?auto=format&fit=crop&w=600&q=80',
    category: 'microcontrollers' as ResourceCategory,
  },
  {
    label: 'DHT11 Environmental Sensor',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    category: 'sensors' as ResourceCategory,
  },
  {
    label: 'Fluke Bench Multimeter',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    category: 'test_equipment' as ResourceCategory,
  },
  {
    label: 'DC Motor & H-Bridge Driver',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
    category: 'actuators_motors' as ResourceCategory,
  },
];

export default function SenderNewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    category: 'microcontrollers' as ResourceCategory,
    description: '',
    imageUrl: PHOTO_PRESETS[0].url,
    totalQuantity: 5,
    dailyRateRupees: 0,
    depositRupees: 0,
    condition: 'brand_new' as Resource['condition'],
    locationDescription: 'Main Electronics Lab — Rack B2',
    minLoanDuration: 1,
    maxLoanDuration: 14,
    trainingRequired: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setLoading(true);
    setError(null);

    try {
      // Use default NIT institution if not explicitly selected
      const res = await createResourceAction({
        institutionId: '11111111-1111-1111-1111-111111111111',
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category: formData.category,
        description: formData.description || `${formData.name} for laboratory experimentation and academic projects.`,
        specifications: {
          voltage: '3.3V - 5V',
          interface: 'GPIO / I2C / SPI',
        },
        imageUrl: formData.imageUrl,
        totalQuantity: Number(formData.totalQuantity),
        dailyRatePaise: Math.round(Number(formData.dailyRateRupees) * 100),
        depositPaise: Math.round(Number(formData.depositRupees) * 100),
        condition: formData.condition,
        locationDescription: formData.locationDescription,
        minLoanDuration: Number(formData.minLoanDuration),
        maxLoanDuration: Number(formData.maxLoanDuration),
        approvalRequired: true,
        trainingRequired: formData.trainingRequired,
        eligibilityPolicy: 'verified_members_only',
      });

      if (res.success) {
        router.push('/sender/inventory');
      } else {
        setError(res.error || 'Failed to list product');
      }
    } catch (err: any) {
      setError(err?.message || 'Error creating equipment listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <Link
          href="/sender/inventory"
          className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-slate-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">List Electronics Product with Photos</h1>
          <p className="text-xs text-slate-400">Add equipment to your laboratory&apos;s resource sharing catalog.</p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-700 text-xs text-red-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-5 shadow-xl">
        {/* Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Equipment / Product Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. ESP32-S3 AI Voice Development Board"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="microcontrollers">Microcontrollers</option>
              <option value="single_board_computers">Single Board Computers (RPi, etc.)</option>
              <option value="sensors">Sensors & Telemetry</option>
              <option value="actuators_motors">Motors & Actuators</option>
              <option value="test_equipment">Laboratory Test Bench</option>
              <option value="robotics">Robotics Chassis & Kits</option>
              <option value="prototyping">Prototyping & Accessories</option>
            </select>
          </div>
        </div>

        {/* Product Photo Selector & Presets */}
        <div className="space-y-3 p-4 bg-neutral-950 rounded-xl border border-neutral-800">
          <label className="text-xs font-bold text-white flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-amber-400" /> Equipment Photo
          </label>
          <p className="text-[11px] text-slate-400">
            Select a high-resolution laboratory equipment photo preset or enter a direct image URL.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PHOTO_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setFormData({ ...formData, imageUrl: p.url, category: p.category })}
                className={`p-2 rounded-lg border text-left flex items-center gap-2 transition ${
                  formData.imageUrl === p.url
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                    : 'bg-neutral-900 border-neutral-800 text-slate-300 hover:border-neutral-700'
                }`}
              >
                <img src={p.url} alt={p.label} className="w-10 h-10 object-cover rounded shrink-0" />
                <span className="text-[11px] font-medium leading-tight truncate">{p.label}</span>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Or Custom Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://..."
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          {formData.imageUrl && (
            <div className="mt-2 flex items-center gap-3 p-2 bg-neutral-900 rounded-lg">
              <img
                src={formData.imageUrl}
                alt="Selected preview"
                className="w-20 h-16 object-cover rounded-md border border-neutral-700 shrink-0"
              />
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Ready for listing catalog
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Description & Laboratory Specifications</label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Technical details, included accessories, pin headers, voltage tolerances..."
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Quantities & Pricing */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Total Quantity</label>
            <input
              type="number"
              min="1"
              max="50"
              required
              value={formData.totalQuantity}
              onChange={(e) => setFormData({ ...formData, totalQuantity: parseInt(e.target.value) || 1 })}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Rate (₹) [0 for Free]</label>
            <input
              type="number"
              min="0"
              value={formData.dailyRateRupees}
              onChange={(e) => setFormData({ ...formData, dailyRateRupees: parseInt(e.target.value) || 0 })}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Refundable Deposit (₹)</label>
            <input
              type="number"
              min="0"
              value={formData.depositRupees}
              onChange={(e) => setFormData({ ...formData, depositRupees: parseInt(e.target.value) || 0 })}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Duration Limits */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Min Loan Duration (Days)</label>
            <input
              type="number"
              min="1"
              value={formData.minLoanDuration}
              onChange={(e) => setFormData({ ...formData, minLoanDuration: parseInt(e.target.value) || 1 })}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Max Loan Duration (Days)</label>
            <input
              type="number"
              min="1"
              value={formData.maxLoanDuration}
              onChange={(e) => setFormData({ ...formData, maxLoanDuration: parseInt(e.target.value) || 14 })}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 text-navy-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
          {loading ? 'Publishing to Catalog...' : 'Publish Product to Network'}
        </button>
      </form>
    </div>
  );
}
