'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Resource, Institution } from '@/types/database';
import { DEMO_USERS } from '@/lib/auth/demo-users';
import { switchDemoUser } from '@/app/actions/auth';
import { formatCurrency } from '@/lib/utils';
import { TextMorph } from '@/components/core/text-morph';
import { TextRoll } from '@/components/core/text-roll';
import { AnimatedNumber } from '@/components/core/animated-number';
import { TextMorphButton, AnimatedNumberBasic, AppleStyleDock } from '@/components/core/examples';
import {
  Search,
  Cpu,
  Compass,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Building2,
  GraduationCap,
  SlidersHorizontal,
  X,
  QrCode,
  FileCheck2,
  Clock,
  Wrench,
  Tag,
} from 'lucide-react';

interface InteractiveScrollSearchProps {
  initialResources: Resource[];
  institutions: Institution[];
}

export function InteractiveScrollSearch({
  initialResources,
  institutions,
}: InteractiveScrollSearchProps) {
  const router = useRouter();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('all');
  const [freeOnly, setFreeOnly] = useState<boolean>(false);
  const [filterModeText, setFilterModeText] = useState('All Hardware');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const keepers = DEMO_USERS.filter((u) => u.platformType === 'sender');
  const seekers = DEMO_USERS.filter((u) => u.platformType === 'receiver');

  // Filter categories with real counts
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    initialResources.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return [
      { id: 'all', label: 'All Equipment', count: initialResources.length },
      { id: 'microcontrollers', label: 'Microcontrollers', count: counts['microcontrollers'] || 0 },
      { id: 'sensors', label: 'Sensors', count: counts['sensors'] || 0 },
      { id: 'test_equipment', label: 'Test Equipment', count: counts['test_equipment'] || 0 },
      { id: 'actuators_motors', label: 'Robotics & Motors', count: counts['actuators_motors'] || 0 },
      { id: 'passives_prototyping', label: 'Prototyping Kits', count: counts['passives_prototyping'] || 0 },
    ];
  }, [initialResources]);

  // Client-side filtered list
  const filteredResources = useMemo(() => {
    return initialResources.filter((res) => {
      // Text match
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        res.name.toLowerCase().includes(query) ||
        res.description.toLowerCase().includes(query) ||
        (res.specifications?.manufacturer &&
          String(res.specifications.manufacturer).toLowerCase().includes(query)) ||
        (res.institution?.name && res.institution.name.toLowerCase().includes(query));

      // Category match
      const matchesCategory = selectedCategory === 'all' || res.category === selectedCategory;

      // Institution match
      const matchesInst =
        selectedInstitution === 'all' || res.institution_id === selectedInstitution;

      // Free only match
      const matchesFree = !freeOnly || res.daily_rate_paise === 0;

      return matchesQuery && matchesCategory && matchesInst && matchesFree;
    });
  }, [initialResources, searchQuery, selectedCategory, selectedInstitution, freeOnly]);

  const handleToggleFree = () => {
    const next = !freeOnly;
    setFreeOnly(next);
    setFilterModeText(next ? 'Free Only (₹0)' : 'All Hardware');
  };

  const handleQuickLogin = async (userId: string, targetPath: string) => {
    setLoadingId(userId);
    try {
      await switchDemoUser(userId, targetPath);
    } catch {
      router.push(targetPath);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-16 md:space-y-24">
      {/* ======================================================================= */}
      {/* 1. HERO SECTION WITH TEXT EFFECTS & INTERACTIVE SEARCH BAR */}
      {/* ======================================================================= */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        {/* Guild Seal Badge with animated effect */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#263447]/90 border border-[#C49A55]/40 text-[#F1E7D0] text-xs font-semibold mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#C49A55] animate-pulse" />
          <span className="tracking-wider uppercase text-[11px] font-mono text-[#C49A55]">
            Consortium of Electronics Keepers &amp; Seekers
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#67C7D4]" />
        </div>

        {/* Rolling Text Headline */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-5xl mx-auto">
          <TextRoll className="text-[#F1E7D0]">
            Share Resources.
          </TextRoll>
          <TextRoll className="text-[#C49A55]">
            Build Possibilities.
          </TextRoll>
        </div>

        <p className="mt-6 text-base sm:text-xl text-[#F1E7D0]/80 max-w-3xl mx-auto leading-relaxed font-sans font-light">
          Connecting schools and colleges possessing underused electronics equipment with verified students and builders seeking hardware.
        </p>

        {/* Live Animated Metrics Row (Using AnimatedNumber) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 p-4 rounded-2xl bg-[#263447]/60 border border-[#263447] max-w-3xl mx-auto backdrop-blur-md">
          {/* Active Seekers with user's star SVG */}
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="16"
              height="16"
              className="h-4 w-4 fill-transparent stroke-[#C49A55] stroke-[1.5]"
            >
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
            </svg>
            <AnimatedNumber
              className="font-mono text-xl sm:text-2xl font-bold text-[#F1E7D0]"
              springOptions={{ bounce: 0, duration: 1800 }}
              value={2082}
            />
            <span className="text-xs text-[#F1E7D0]/60 font-mono">Active Seekers</span>
          </div>

          <div className="h-4 w-px bg-[#F1E7D0]/20 hidden sm:block" />

          {/* Cataloged Hardware Units */}
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#67C7D4]" />
            <AnimatedNumber
              className="font-mono text-xl sm:text-2xl font-bold text-[#67C7D4]"
              springOptions={{ bounce: 0, duration: 2000 }}
              value={initialResources.length}
            />
            <span className="text-xs text-[#F1E7D0]/60 font-mono">Cataloged Electronics</span>
          </div>

          <div className="h-4 w-px bg-[#F1E7D0]/20 hidden sm:block" />

          {/* Participating Institutions */}
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#C49A55]" />
            <AnimatedNumber
              className="font-mono text-xl sm:text-2xl font-bold text-[#C49A55]"
              springOptions={{ bounce: 0, duration: 1500 }}
              value={institutions.length}
            />
            <span className="text-xs text-[#F1E7D0]/60 font-mono">Partner Labs</span>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* INTERACTIVE LIVE SEARCH BAR (ANCHOR: #search) */}
        {/* ===================================================================== */}
        <div id="search" className="mt-10 max-w-4xl mx-auto scroll-mt-20">
          <div className="relative flex items-center p-2 rounded-2xl bg-[#263447]/95 border-2 border-[#C49A55]/40 focus-within:border-[#C49A55] shadow-2xl transition-all">
            <Search className="w-6 h-6 text-[#C49A55] ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Arduino Uno, ESP32, DHT11, Oscilloscope, Raspberry Pi, Sensors..."
              className="w-full bg-transparent px-4 py-3 text-sm sm:text-base text-[#F1E7D0] placeholder-[#F1E7D0]/40 outline-none font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1.5 rounded-lg text-[#F1E7D0]/50 hover:text-[#F1E7D0] hover:bg-[#141821] transition mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Morphing Filter Toggle Button */}
            <button
              onClick={handleToggleFree}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141821] border border-[#263447] text-xs font-semibold text-[#F1E7D0] hover:border-[#67C7D4] transition shrink-0"
              title="Toggle Free For Students Only"
            >
              <Filter className="w-3.5 h-3.5 text-[#67C7D4]" />
              <TextMorph>{filterModeText}</TextMorph>
            </button>
          </div>

          {/* Quick Query Suggestions */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-[#F1E7D0]/60">
            <span className="font-mono text-[11px] text-[#C49A55]">Quick query:</span>
            {['ESP32', 'Arduino Uno', 'Raspberry Pi', 'DHT11', 'Oscilloscope', 'Multimeter', 'Relay'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-2.5 py-1 rounded-lg bg-[#263447]/70 hover:bg-[#263447] border border-[#263447] text-[#F1E7D0]/80 hover:text-[#F1E7D0] hover:border-[#67C7D4]/40 transition text-[11px] font-mono"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                    active
                      ? 'bg-[#C49A55] text-[#141821] font-bold shadow-md shadow-[#C49A55]/20'
                      : 'bg-[#263447]/80 text-[#F1E7D0]/70 hover:text-[#F1E7D0] hover:bg-[#263447] border border-[#263447]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      active ? 'bg-[#141821]/20 text-[#141821]' : 'bg-[#141821] text-[#F1E7D0]/60'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Institution Selector Filter */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[#F1E7D0]/60 font-mono text-[11px] flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#C49A55]" /> Institution:
            </span>
            <button
              onClick={() => setSelectedInstitution('all')}
              className={`px-2.5 py-1 rounded-lg transition ${
                selectedInstitution === 'all'
                  ? 'bg-[#67C7D4]/20 text-[#67C7D4] border border-[#67C7D4]/40 font-bold'
                  : 'text-[#F1E7D0]/60 hover:text-[#F1E7D0]'
              }`}
            >
              All (3)
            </button>
            {institutions.map((inst) => (
              <button
                key={inst.id}
                onClick={() => setSelectedInstitution(inst.id)}
                className={`px-2.5 py-1 rounded-lg transition truncate max-w-[200px] ${
                  selectedInstitution === inst.id
                    ? 'bg-[#67C7D4]/20 text-[#67C7D4] border border-[#67C7D4]/40 font-bold'
                    : 'text-[#F1E7D0]/60 hover:text-[#F1E7D0]'
                }`}
              >
                {inst.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* 2. LIVE INTERACTIVE EQUIPMENT SEARCH RESULTS GRID */}
      {/* ======================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#263447]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#263447] border border-[#C49A55]/30 flex items-center justify-center text-[#C49A55]">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                Available Electronics ({filteredResources.length})
              </h2>
              <p className="text-xs text-slate-600">
                Click any hardware item to review specifications, safety requirements, and request borrowing.
              </p>
            </div>
          </div>

          <Link
            href="/receiver/explore"
            className="text-xs font-bold text-[#67C7D4] hover:underline flex items-center gap-1.5"
          >
            Full Catalog View &rarr;
          </Link>
        </div>

        {filteredResources.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#263447]/40 border border-[#263447] space-y-3">
            <Search className="w-10 h-10 text-[#F1E7D0]/30 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[#F1E7D0]">No matching electronics found</h3>
            <p className="text-xs text-[#F1E7D0]/60 max-w-md mx-auto">
              Try adjusting your search terms or reset filters to explore all available hardware across the consortium.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedInstitution('all');
                setFreeOnly(false);
                setFilterModeText('All Hardware');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-[#C49A55] text-[#141821] font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResources.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl bg-[#263447] border border-[#263447] hover:border-[#C49A55]/60 overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo container */}
                  <div className="relative h-44 w-full bg-[#141821] overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#F1E7D0]/30">
                        <Cpu className="w-12 h-12" />
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-[#141821]/85 backdrop-blur-md text-[#C49A55] border border-[#C49A55]/30">
                      {item.category.replace('_', ' ')}
                    </span>
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#141821]/85 backdrop-blur-md text-[#67C7D4] border border-[#67C7D4]/30">
                      {item.available_quantity} Available
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-serif font-bold text-sm text-[#F1E7D0] line-clamp-1 group-hover:text-[#C49A55] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-[#F1E7D0]/60 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-2 border-t border-[#F1E7D0]/10 flex items-center justify-between text-xs">
                      <span className="font-bold text-[#F1E7D0]">
                        {item.daily_rate_paise > 0
                          ? formatCurrency(item.daily_rate_paise, false)
                          : 'Free (₹0)'}
                        <span className="text-[10px] font-normal text-[#F1E7D0]/50"> /day</span>
                      </span>
                      <span className="text-[10px] text-[#C49A55] font-mono">
                        {item.deposit_paise > 0 ? `₹${item.deposit_paise / 100} dep` : 'No deposit'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#141821]/60 border-t border-[#F1E7D0]/10 flex items-center justify-between text-[11px]">
                  <span className="text-[#F1E7D0]/60 truncate max-w-[140px] font-sans">
                    {item.institution?.name}
                  </span>
                  <Link
                    href={`/resources/${item.id}`}
                    className="font-bold text-[#67C7D4] hover:text-[#88dce7] flex items-center gap-1 group-hover:translate-x-0.5 transition"
                  >
                    Request &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ======================================================================= */}
      {/* 3. THE TWO GUILD PORTALS: KEEPER & SEEKER (ANCHOR: #portals) */}
      {/* ======================================================================= */}
      <section id="portals" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#263447] text-[#C49A55] border border-[#C49A55]/30 mb-2">
            <Shield className="w-3.5 h-3.5" /> Guild Portals
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Choose Your Platform Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Login as a Keeper to manage laboratory inventory and verify photo IDs, or as a Seeker to discover and borrow components.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          {/* ================================================================= */}
          {/* KEEPER PORTAL */}
          {/* ================================================================= */}
          <div className="rounded-3xl bg-[#263447] border border-[#C49A55]/40 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-[#C49A55] transition-all">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#C49A55]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between pb-4 border-b border-[#F1E7D0]/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#141821] border border-[#C49A55]/40 text-[#C49A55] flex items-center justify-center">
                    <Shield className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-mono tracking-wider text-[#C49A55] font-bold">
                      Those who possess
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#F1E7D0]">
                      Keeper Portal
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-[#141821] px-2.5 py-1 rounded-full text-[#C49A55] border border-[#C49A55]/30">
                  Labs &amp; Custodians
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#F1E7D0]/70 font-sans leading-relaxed">
                For laboratory heads and equipment custodians. List hardware with photos, inspect borrower photo IDs, click Manual Verified, and present Handover QR codes with active countdown timers.
              </p>

              {/* Primary Entry Button */}
              <div className="space-y-2">
                <Link
                  href="/sender/login"
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#C49A55] hover:bg-[#d4aa65] text-[#141821] font-bold text-sm text-center transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4 fill-current" />
                  <span>Join / Sign In as Keeper</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <div className="text-center">
                  <Link
                    href="/sender/signup"
                    className="text-[11px] text-[#F1E7D0]/60 hover:text-[#C49A55] underline underline-offset-4 transition"
                  >
                    Register a New Institutional Lab &rarr;
                  </Link>
                </div>
              </div>

              {/* One-Click Demo Selection */}
              <div className="pt-4 border-t border-[#F1E7D0]/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-[#C49A55] uppercase tracking-wider flex items-center gap-1.5">
                    Instant Demo Login (Keepers)
                  </span>
                  <span className="text-[10px] text-[#F1E7D0]/50 font-mono">2 Colleges • 1 School</span>
                </div>

                <div className="space-y-2">
                  {keepers.map((u, idx) => (
                    <button
                      key={u.id}
                      onClick={() => handleQuickLogin(u.id, '/sender')}
                      disabled={loadingId !== null}
                      className="w-full text-left p-3 rounded-xl bg-[#141821] hover:bg-[#1a202c] border border-[#263447] hover:border-[#C49A55]/60 transition-all flex items-center justify-between group/item disabled:opacity-50"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-bold text-[#F1E7D0] group-hover/item:text-[#C49A55] flex items-center gap-1.5">
                          <span className="truncate">{u.name}</span>
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#C49A55]/15 text-[#C49A55] border border-[#C49A55]/30 shrink-0">
                            {idx === 2 ? 'School' : 'College'}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#F1E7D0]/70 truncate mt-0.5 font-sans">
                          {u.instituteName}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#F1E7D0]/40 group-hover/item:text-[#C49A55] transition shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* SEEKER PORTAL */}
          {/* ================================================================= */}
          <div className="rounded-3xl bg-[#263447] border border-[#67C7D4]/40 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-[#67C7D4] transition-all">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#67C7D4]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between pb-4 border-b border-[#F1E7D0]/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#141821] border border-[#67C7D4]/40 text-[#67C7D4] flex items-center justify-center">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-mono tracking-wider text-[#67C7D4] font-bold">
                      Those who seek
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#F1E7D0]">
                      Seeker Portal
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-[#141821] px-2.5 py-1 rounded-full text-[#67C7D4] border border-[#67C7D4]/30">
                  Students &amp; Faculty
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#F1E7D0]/70 font-sans leading-relaxed">
                For students, teachers, and project builders. Search cataloged electronics, assemble AI project recipes, submit photo ID, and scan Handover QR codes at physical pickup.
              </p>

              {/* Primary Entry Button */}
              <div className="space-y-2">
                <Link
                  href="/receiver/login"
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#67C7D4] hover:bg-[#7ed2dd] text-[#141821] font-bold text-sm text-center transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Join / Sign In as Seeker</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <div className="text-center">
                  <Link
                    href="/receiver/signup"
                    className="text-[11px] text-[#F1E7D0]/60 hover:text-[#67C7D4] underline underline-offset-4 transition"
                  >
                    Register as a New Borrower &rarr;
                  </Link>
                </div>
              </div>

              {/* One-Click Demo Selection */}
              <div className="pt-4 border-t border-[#F1E7D0]/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-[#67C7D4] uppercase tracking-wider flex items-center gap-1.5">
                    Instant Demo Login (Seekers)
                  </span>
                  <span className="text-[10px] text-[#F1E7D0]/50 font-mono">2 Colleges • 1 School</span>
                </div>

                <div className="space-y-2">
                  {seekers.map((u, idx) => (
                    <button
                      key={u.id}
                      onClick={() => handleQuickLogin(u.id, '/receiver')}
                      disabled={loadingId !== null}
                      className="w-full text-left p-3 rounded-xl bg-[#141821] hover:bg-[#1a202c] border border-[#263447] hover:border-[#67C7D4]/60 transition-all flex items-center justify-between group/item disabled:opacity-50"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-bold text-[#F1E7D0] group-hover/item:text-[#67C7D4] flex items-center gap-1.5">
                          <span className="truncate">{u.name}</span>
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#67C7D4]/15 text-[#67C7D4] border border-[#67C7D4]/30 shrink-0">
                            {idx === 2 ? 'School' : 'College'}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#F1E7D0]/70 truncate mt-0.5 font-sans">
                          {u.instituteName}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#F1E7D0]/40 group-hover/item:text-[#67C7D4] transition shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* 4. SCIENTIFIC CHEF PROJECT RECIPES (ANCHOR: #recipe) */}
      {/* ======================================================================= */}
      <section id="recipe" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-20">
        <div className="rounded-3xl bg-gradient-to-br from-[#263447] via-[#1a2330] to-[#141821] border border-[#67C7D4]/40 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#67C7D4]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#67C7D4]/15 text-[#67C7D4] border border-[#67C7D4]/30">
                <Sparkles className="w-3.5 h-3.5" /> Scientific Chef Recipes
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#F1E7D0] leading-tight">
                Plan Your Circuit with Project Recipes
              </h3>
              <p className="text-sm text-[#F1E7D0]/80 leading-relaxed font-sans font-light">
                Specify what you want to build—such as an automated greenhouse, an obstacle-avoiding rover, or a pulse oximeter.
                Scientific Chef generates the verified bill of materials, pin-to-pin wiring tips, and checks real-time availability across all three partner labs.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/receiver/project-recipe"
                  className="px-6 py-3 rounded-xl bg-[#67C7D4] hover:bg-[#7ed2dd] text-[#141821] font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  <Cpu className="w-4 h-4" /> Open Project Recipes &rarr;
                </Link>

                {/* Example TextMorph button directly in action */}
                <TextMorphButton
                  primaryText="View Blueprint"
                  alternateText="Hide Blueprint"
                  className="flex h-10 w-[140px] shrink-0 items-center justify-center rounded-xl bg-[#263447] border border-[#C49A55]/40 px-4 text-xs font-semibold text-[#F1E7D0] hover:border-[#C49A55]"
                />
              </div>
            </div>

            {/* Circuit Recipe preview */}
            <div className="p-5 rounded-2xl bg-[#141821]/90 border border-[#67C7D4]/30 space-y-3 font-mono text-xs shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#263447]">
                <span className="text-[#67C7D4] font-bold text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> RECIPE: SMART AGRICULTURE NODE
                </span>
                <span className="text-[10px] text-[#C49A55] font-bold">4/4 IN STOCK</span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="p-2 rounded bg-[#263447]/60 border border-[#263447] flex items-center justify-between">
                  <span className="text-[#F1E7D0]">1x ESP32 NodeMCU Wi-Fi/BLE</span>
                  <span className="text-[#67C7D4]">GPIO 4, 34, 26</span>
                </div>
                <div className="p-2 rounded bg-[#263447]/60 border border-[#263447] flex items-center justify-between">
                  <span className="text-[#F1E7D0]">1x DHT11 Humidity Sensor</span>
                  <span className="text-[#C49A55]">10k Pullup @ 3.3V</span>
                </div>
                <div className="p-2 rounded bg-[#263447]/60 border border-[#263447] flex items-center justify-between">
                  <span className="text-[#F1E7D0]">1x Capacitive Soil Moisture Probe</span>
                  <span className="text-[#67C7D4]">ADC1 Channel 6</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-[#F1E7D0]/60 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#67C7D4]" />
                In stock across Apex Institute &amp; Vanguard College
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* 5. THE THREE PILLARS OF GUILD INTEGRITY (ANCHOR: #integrity) */}
      {/* ======================================================================= */}
      <section id="integrity" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C49A55]">
            Accountability Protocol
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
            The Three Pillars of Guild Integrity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#263447]/70 border border-[#263447] hover:border-[#C49A55]/40 transition space-y-3 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#C49A55]/15 border border-[#C49A55]/40 text-[#C49A55] flex items-center justify-center">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#F1E7D0]">
              1. Photo ID Handover Matching
            </h3>
            <p className="text-xs text-[#F1E7D0]/70 leading-relaxed font-sans">
              Equipment is strictly released ONLY to the student or teacher whose verified photo ID card matches upon physical collection. No unauthorized proxy handovers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#263447]/70 border border-[#263447] hover:border-[#67C7D4]/40 transition space-y-3 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#67C7D4]/15 border border-[#67C7D4]/40 text-[#67C7D4] flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#F1E7D0]">
              2. Screen QR &amp; Live Timer Sync
            </h3>
            <p className="text-xs text-[#F1E7D0]/70 leading-relaxed font-sans">
              The Lab Head generates a Handover QR on their screen. Scanning it activates an active deadline countdown timer for both Keeper and Seeker until safe return.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#263447]/70 border border-[#263447] hover:border-[#C49A55]/40 transition space-y-3 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#C49A55]/15 border border-[#C49A55]/40 text-[#C49A55] flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#F1E7D0]">
              3. Immutable Audit Ledger
            </h3>
            <p className="text-xs text-[#F1E7D0]/70 leading-relaxed font-sans">
              Every checkout, loan extension, and inspection return is appended to the tamper-evident audit ledger, protecting both institutions and students.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* 6. APPLE STYLE DOCK SHOWCASE COMPONENT */}
      {/* ======================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-center space-y-4">
        <span className="text-[11px] font-mono text-[#67C7D4] uppercase tracking-wider font-semibold">
          Interactive Motion Dock Navigation
        </span>
        <div className="flex justify-center pt-2">
          <AppleStyleDock />
        </div>
      </section>

      {/* ======================================================================= */}
      {/* 7. INSTITUTION FOOTER BADGES */}
      {/* ======================================================================= */}
      <section className="text-center text-xs text-[#F1E7D0]/50 font-mono flex flex-wrap items-center justify-center gap-4 border-t border-[#263447] pt-8 max-w-4xl mx-auto w-full px-4">
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
      </section>
    </div>
  );
}
