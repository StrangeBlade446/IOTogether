import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Shield, FileText, Lock, Eye, Database, Clock, Building2 } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Privacy Policy & Academic Data Protection',
  description:
    'Learn how the IOTogether academic equipment sharing consortium handles student ID verification pictures, equipment custody logs, and audit ledger records.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy & Academic Data Protection | IOTogether',
    description:
      'Our commitment to student borrower privacy, institutional transparency, and secure laboratory equipment tracking.',
    url: '/privacy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 animate-in fade-in duration-200">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <Shield className="w-3.5 h-3.5 text-emerald-600" /> Academic Compliance &amp; Protection Standard
        </div>
        {/* Single H1 per page (Item 6) */}
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
          Privacy Policy &amp; Data Governance
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
          Last revised: October 2026 &bull; Applicable across Apex Institute of Technology, Vanguard Engineering College, and Horizon STEM Academy.
        </p>
      </div>

      {/* Policy Content Sections */}
      <div className="space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
        {/* Section 1 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-3 shadow-xs">
          <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-teal-600" />
            1. Purpose and Scope of Data Collection
          </h2>
          <p>
            The IOTogether Consortium (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the platform&rdquo;) operates a multi-institutional hardware and laboratory equipment sharing network. We collect only the data necessary to guarantee equipment safety, verify borrowing eligibility, and maintain an immutable record of institutional custody transfers.
          </p>
          <p>
            Participation is restricted to enrolled students, research scholars, teaching faculty, and accredited laboratory custodians of member academic institutions.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-3 shadow-xs">
          <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-amber-600" />
            2. Photo ID Verification &amp; Physical Handover
          </h2>
          <p>
            To prevent proxy checkouts, unauthorized collection, and equipment loss:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>
              Borrowers submit a digital photograph of their institutional Student ID card or Faculty ID card when requesting equipment.
            </li>
            <li>
              During physical pickup, the designated Lab Head compares the physical borrower against the ID photograph and performs a Manual Verification check.
            </li>
            <li>
              Once verified, the Lab Head presents an on-screen Handover QR code which the borrower scans to confirm possession and activate the loan countdown timer.
            </li>
            <li>
              ID card images are encrypted at rest and used strictly for identity verification. They are never indexed by public search engines or shared with commercial third parties.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-3 shadow-xs">
          <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-600" />
            3. Live Loan Countdown Timers &amp; Telemetry
          </h2>
          <p>
            Upon successful QR scan, the system initiates an active loan deadline countdown timer. This timer is visible to both the student borrower and the custodian laboratory. No continuous GPS location or invasive device tracking is installed on borrowed electronics. Accountability is maintained through physical checkout and inspection check-in timestamps.
          </p>
        </section>

        {/* Section 4 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-3 shadow-xs">
          <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-600" />
            4. Immutable Audit Ledger
          </h2>
          <p>
            Every transaction—including reservation submission, manual verification approval, physical handover QR scan, loan extension, and post-return condition inspection—is recorded in the tamper-evident consortium audit ledger.
          </p>
          <p className="text-slate-600">
            Audit logs are retained for the duration of the current academic year to protect both students against false damage claims and institutions against unreturned assets.
          </p>
        </section>

        {/* Section 5 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-3 shadow-xs">
          <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            5. Cookies and Local Session Storage
          </h2>
          <p>
            IOTogether uses strictly necessary HTTP cookies (<code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">iotogether_user_id</code>) to maintain user authentication, remember persona role preferences (Seeker vs. Keeper), and ensure secure session routing.
          </p>
        </section>

        {/* Section 6 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-3 shadow-xs">
          <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            6. Contact Data Protection Officer
          </h2>
          <p>
            For privacy inquiries, audit log inspection requests, or data deletion upon graduation, contact our consortium administrative team via the{' '}
            <Link href="/contact" className="text-teal-700 font-semibold underline underline-offset-4 hover:text-teal-900">
              Custodian Helpdesk
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
