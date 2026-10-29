'use client';

import React, { useState } from 'react';
import { submitContactAction } from '@/app/actions/contact';
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Building2,
  Mail,
  User,
  MessageSquare,
  HelpCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react';

export function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Institution Onboarding',
    institution: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await submitContactAction(formData);
      if (res.success && res.ticketId) {
        setTicketId(res.ticketId);
      } else {
        setError(res.error || 'Failed to send message');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error sending inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTicketId(null);
    setFormData({
      name: '',
      email: '',
      subject: 'Institution Onboarding',
      institution: '',
      message: '',
    });
  };

  if (ticketId) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm text-center space-y-5 animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
            Inquiry Received
          </span>
          <h2 className="text-2xl font-serif font-bold text-slate-900">
            Thank you, {formData.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Your inquiry has been assigned tracking ticket{' '}
            <strong className="text-slate-900 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {ticketId}
            </strong>
            . A consortium laboratory custodian will review your message and respond within 1 business day.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
          >
            Send Another Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Contact Form Card (7 cols) */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="mb-6 pb-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Send an Inquiry</h2>
          <p className="text-xs text-slate-500 mt-1">
            Fill out the form below to reach consortium administrators, laboratory heads, or equipment technicians.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Meera Krishnan"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white transition text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic / Official Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="m.krishnan@vanguard.edu"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white transition text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Inquiry Topic <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white transition text-slate-900"
              >
                <option value="Institution Onboarding">New College / School Lab Onboarding</option>
                <option value="Hardware Loan Inquiry">Hardware Availability & Borrowing</option>
                <option value="ID Verification Assistance">Student / Teacher ID Verification</option>
                <option value="Broken or Damaged Equipment">Incident or Return Report</option>
                <option value="Other Academic Collaboration">Other Academic Collaboration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College, School, or Department
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g. Apex Institute of Technology"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white transition text-slate-900"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Message <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your inquiry, equipment needs, or partnership proposal in detail..."
                className="w-full p-3 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white transition text-slate-900 leading-relaxed"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-5 rounded-xl bg-[#ba4d2b] hover:bg-[#a04022] disabled:opacity-50 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{isSubmitting ? 'Transmitting to Custodian Desk...' : 'Submit Inquiry'}</span>
          </button>
        </form>
      </div>

      {/* Info & Consortium Helpdesks (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-teal-400 font-bold block">
            Partner Hub Locations
          </span>
          <h3 className="text-lg font-serif font-bold text-white">
            Consortium Laboratory Desks
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            Equipment handovers and physical ID verifications take place at member laboratory front desks during scheduled academic hours.
          </p>

          <div className="space-y-3 pt-2 text-xs border-t border-slate-800">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <div className="font-bold text-slate-200 flex items-center justify-between">
                <span>Apex Institute of Technology</span>
                <span className="text-[10px] text-teal-400 font-mono">College 1</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Embedded Systems Lab — Tech Block C, Room 204
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <div className="font-bold text-slate-200 flex items-center justify-between">
                <span>Vanguard Engineering College</span>
                <span className="text-[10px] text-amber-400 font-mono">College 2</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Central Makerspace &amp; Instrumentation Facility — Innovation Tower
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <div className="font-bold text-slate-200 flex items-center justify-between">
                <span>Horizon STEM Academy</span>
                <span className="text-[10px] text-cyan-400 font-mono">School 1</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Robotics Discovery Studio — Science Wing, 1st Floor
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 space-y-2 shadow-xs">
          <div className="font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Academic Verification Guarantee</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            All equipment checkouts require physical student photo ID matching and screen QR scanning to protect institutional laboratory assets.
          </p>
        </div>
      </div>
    </div>
  );
}
