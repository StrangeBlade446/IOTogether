import React from 'react';
import type { Metadata } from 'next';
import { ContactClient } from './ContactClient';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Mail, MessageSquare } from 'lucide-react';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Contact Laboratory Custodians & Support Desk',
  description:
    'Get in touch with the IOTogether academic equipment consortium administrators for institutional onboarding, student borrower support, and hardware custody inquiries.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Laboratory Custodians | IOTogether',
    description:
      'Reach out to university lab heads and consortium administrators regarding equipment sharing, hardware loans, and institutional participation.',
    url: '/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6 animate-in fade-in duration-200">
      <Breadcrumbs items={[{ label: 'Contact Helpdesk' }]} />

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
          <MessageSquare className="w-3.5 h-3.5 text-amber-600" /> Consortium Helpdesk &amp; Support
        </div>
        {/* Single H1 per page (Item 6) */}
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Mail className="w-8 h-8 text-[#ba4d2b]" />
          Contact Academic Consortium Custodians
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          Have questions about institutional onboarding, equipment checkouts, or photo ID verifications? Submit your message below to connect with our member lab heads.
        </p>
      </div>

      <ContactClient />
    </div>
  );
}
