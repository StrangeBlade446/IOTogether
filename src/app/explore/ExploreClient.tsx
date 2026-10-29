'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Resource, Institution } from '@/types/database';
import { formatCurrency, getStatusBadge } from '@/lib/utils';
import {
  Search,
  Filter,
  CheckCircle,
  Building,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Layers,
} from 'lucide-react';

interface ExploreClientProps {
  initialResources: Resource[];
  institutions: Institution[];
}

export function ExploreClient({ initialResources, institutions }: ExploreClientProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('all');
  const [pricingType, setPricingType] = useState<'all' | 'free' | 'paid'>('all');
  const [trainingFilter, setTrainingFilter] = useState<'all' | 'required' | 'not_required'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'available' | 'price_asc' | 'price_desc'>('available');

  const categories = [
    { id: 'all', label: 'All Equipment' },
    { id: 'microcontrollers', label: 'Microcontrollers' },
    { id: 'single_board_computers', label: 'Single-Board Computers' },
    { id: 'sensors', label: 'Sensors' },
    { id: 'test_equipment', label: 'Test & Measurement' },
    { id: 'robotics', label: 'Robotics & Actuators' },
  ];

  const filtered = useMemo(() => {
    return initialResources
      .filter((r) => {
        // Search
        if (search) {
          const s = search.toLowerCase();
          const matchName = r.name.toLowerCase().includes(s);
          const matchDesc = r.description.toLowerCase().includes(s);
          const matchInst = r.institution?.name.toLowerCase().includes(s);
          const matchCat = r.category.toLowerCase().includes(s);
          if (!matchName && !matchDesc && !matchInst && !matchCat) return false;
        }

        // Category
        if (selectedCategory !== 'all' && r.category !== selectedCategory) {
          return false;
        }

        // Institution
        if (selectedInstitution !== 'all' && r.institution_id !== selectedInstitution) {
          return false;
        }

        // Pricing
        if (pricingType === 'free' && r.daily_rate_paise > 0) return false;
        if (pricingType === 'paid' && r.daily_rate_paise === 0) return false;

        // Training
        if (trainingFilter === 'required' && !r.training_required) return false;
        if (trainingFilter === 'not_required' && r.training_required) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'available') {
          return (b.available_quantity || 0) - (a.available_quantity || 0);
        }
        if (sortBy === 'price_asc') {
          return a.daily_rate_paise - b.daily_rate_paise;
        }
        if (sortBy === 'price_desc') {
          return b.daily_rate_paise - a.daily_rate_paise;
        }
        return a.name.localeCompare(b.name);
      });
  }, [initialResources, search, selectedCategory, selectedInstitution, pricingType, trainingFilter, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedInstitution('all');
    setPricingType('all');
    setTrainingFilter('all');
    setSortBy('available');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Arduino, Raspberry Pi, sensors, multimeters..."
            className="w-full pl-10 pr-4 py-2 bg-navy-850 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Institution Selector */}
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-400" />
            <select
              value={selectedInstitution}
              onChange={(e) => setSelectedInstitution(e.target.value)}
              className="bg-navy-850 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Institutions</option>
              {institutions.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>

          {/* Pricing filter */}
          <select
            value={pricingType}
            onChange={(e) => setPricingType(e.target.value as any)}
            className="bg-navy-850 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Pricing (Free & Paid)</option>
            <option value="free">Free Borrowing Only</option>
            <option value="paid">Deposit / Paid Only</option>
          </select>

          {/* Training filter */}
          <select
            value={trainingFilter}
            onChange={(e) => setTrainingFilter(e.target.value as any)}
            className="bg-navy-850 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Any Training Policy</option>
            <option value="not_required">No Special Training</option>
            <option value="required">Training Required</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-navy-850 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="available">Highest Availability</option>
            <option value="name">Alphabetical</option>
            <option value="price_asc">Rental Rate: Low to High</option>
            <option value="price_desc">Rental Rate: High to Low</option>
          </select>

          {(search || selectedCategory !== 'all' || selectedInstitution !== 'all' || pricingType !== 'all' || trainingFilter !== 'all') && (
            <button
              onClick={resetFilters}
              className="p-2 text-xs text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
              title="Reset All Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                active
                  ? 'bg-cyan-500 text-navy-950 border-cyan-400 font-bold shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Active Results Summary */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-white font-semibold">{filtered.length}</strong> equipment items
        </span>
        <span className="flex items-center gap-1.5 text-cyan-400/80">
          <ShieldCheck className="w-3.5 h-3.5" />
          Real-time stock reservation checked
        </span>
      </div>

      {/* Grid of Resource Cards */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-slate-900/50 border border-slate-800 p-8">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No equipment matches your filter criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Try adjusting your search terms, changing the institution filter, or resetting the filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-semibold transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((r) => {
            const isFree = r.daily_rate_paise === 0;
            const cond = getStatusBadge(r.condition);
            const available = r.available_quantity || 0;
            const hasStock = available > 0;

            return (
              <Link
                key={r.id}
                href={`/resources/${r.id}`}
                className="group flex flex-col rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all overflow-hidden shadow-sm hover:shadow-cyan-500/10 hover:-translate-y-1"
              >
                {/* Image & Overlay Badges */}
                <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.image_url || 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=500'}
                    alt={`${r.name} - ${r.category.replace('_', ' ')} available at ${r.institution?.name || 'partner lab'}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${cond.bg} ${cond.text} ${cond.border}`}>
                      {cond.label}
                    </span>
                    {r.training_required && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-amber-950/80 text-amber-300 border-amber-800">
                        TRAINING REQ.
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2 right-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded shadow ${
                        isFree
                          ? 'bg-emerald-600 text-white'
                          : 'bg-navy-950 text-cyan-300 border border-cyan-800'
                      }`}
                    >
                      {formatCurrency(r.daily_rate_paise)} {isFree ? '' : '/ day'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="uppercase tracking-wider font-medium text-cyan-400/90">
                      {r.category.replace('_', ' ')}
                    </span>
                    <span
                      className={`font-semibold ${
                        hasStock ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {hasStock ? `${available} available` : 'Waitlist Only'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mt-1 group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {r.name}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 flex-1">
                    {r.description}
                  </p>

                  {/* Pricing Breakdown & Deposit */}
                  <div className="mt-3 pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Deposit:</span>
                    <span className="font-semibold text-slate-300">
                      {r.deposit_paise > 0 ? formatCurrency(r.deposit_paise, false) : 'None'}
                    </span>
                  </div>

                  {/* Institution Location */}
                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[150px] font-medium text-slate-300 flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      {r.institution?.name}
                    </span>
                    <span className="text-[10px] text-slate-400">{r.institution?.city}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
