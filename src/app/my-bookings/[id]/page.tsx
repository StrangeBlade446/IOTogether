import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db/store';
import { getSession } from '@/lib/auth/session';
import { formatCurrency, formatDate, formatDateTime, getStatusBadge } from '@/lib/utils';
import {
  ArrowLeft,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck2,
  FileText,
  ShieldAlert,
  ShieldCheck,
  User,
  AlertTriangle,
  QrCode,
} from 'lucide-react';
import QRCode from 'qrcode';

export const revalidate = 0;

interface PageProps {
  params: { id: string };
}

export default async function BookingDetailPage({ params }: PageProps) {
  const booking = db.getBooking(params.id);
  if (!booking) {
    notFound();
  }

  const session = await getSession();

  // Condition reports for this booking
  const conditionReports = db.getConditionReports(booking.id);
  const incidents = db.getIncidents().filter((i) => i.booking_id === booking.id);

  // Filter audit logs relating to this booking
  const auditLogs = db.getAuditLogs().filter((a) => a.entity_id === booking.id || a.metadata?.bookingId === booking.id);

  let qrCodeDataUrl = '';
  try {
    const bookingReceipt = JSON.stringify({
      bookingId: booking.id,
      borrower: booking.borrower?.display_name,
      equipment: booking.resource?.name,
      status: booking.status,
    });
    qrCodeDataUrl = await QRCode.toDataURL(bookingReceipt, { margin: 1, width: 150, color: { dark: '#06b6d4', light: '#0a0f1d' } });
  } catch (err) {
    console.error('QR code error:', err);
  }

  const status = getStatusBadge(booking.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <Link
        href="/my-bookings"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Bookings
      </Link>

      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded border ${status.bg} ${status.text} ${status.border}`}>
                {status.label}
              </span>
              <span className="text-xs text-slate-400">ID: {booking.id.slice(0, 8)}...</span>
            </div>
            <h1 className="text-2xl font-black text-cyan-100 mt-2">
              {booking.quantity}x {booking.resource?.name}
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              {booking.resource?.institution?.name} • {booking.resource?.location_description}
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
            <span className="text-xs text-slate-400 font-medium">Agreed Price Snapshot</span>
            <div className="text-2xl font-black text-white mt-0.5">
              {formatCurrency(booking.estimated_total_paise)}
            </div>
            <span className="text-[11px] text-cyan-400 font-semibold block capitalize">
              Payment: {booking.payment_status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Date Timeline bar */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400">Pickup Scheduled:</span>
            <p className="font-semibold text-white mt-0.5">{formatDate(booking.start_at)}</p>
          </div>
          <div>
            <span className="text-slate-400">Return Due:</span>
            <p className="font-semibold text-amber-400 mt-0.5">{formatDate(booking.due_at)}</p>
          </div>
          <div>
            <span className="text-slate-400">Borrower:</span>
            <p className="font-semibold text-slate-200 mt-0.5">{booking.borrower?.display_name}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left 7 cols: Audit Timeline & Condition Reports */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {/* Condition Reports Inspection Evidence */}
          {conditionReports.length > 0 && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <FileCheck2 className="w-5 h-5 text-cyan-400" />
                Physical Inspection & Condition Evidence
              </h2>

              <div className="space-y-4">
                {conditionReports.map((cr) => {
                  const condBadge = getStatusBadge(cr.condition);
                  return (
                    <div key={cr.id} className="p-4 rounded-xl bg-navy-850 border border-slate-800 text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                          {cr.report_type === 'checkout' ? 'Initial Checkout Inspection' : 'Return Handover Inspection'}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${condBadge.bg} ${condBadge.text} ${condBadge.border}`}>
                          {condBadge.label}
                        </span>
                      </div>

                      <p className="text-slate-300 italic mb-3">"{cr.notes}"</p>

                      {cr.evidence_paths.length > 0 && (
                        <div className="flex gap-2">
                          {cr.evidence_paths.map((imgUrl, idx) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={idx}
                              src={imgUrl}
                              alt="Condition evidence"
                              className="w-20 h-20 rounded-lg object-cover border border-slate-700 bg-slate-950"
                            />
                          ))}
                        </div>
                      )}

                      <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Submitted by: {cr.submitter?.display_name || 'Lab Staff'}</span>
                        <span>{formatDateTime(cr.created_at)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Incidents (if any) */}
          {incidents.length > 0 && (
            <div className="rounded-2xl bg-rose-950/40 border border-rose-800/80 p-6">
              <h2 className="text-base font-bold text-rose-300 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                Associated Incident Investigation
              </h2>

              <div className="space-y-3">
                {incidents.map((inc) => (
                  <div key={inc.id} className="p-4 rounded-xl bg-slate-900 border border-rose-900/60 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-rose-400 uppercase tracking-wide">
                        {inc.incident_type} Incident
                      </span>
                      <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-semibold uppercase">
                        {inc.status}
                      </span>
                    </div>

                    <p className="text-slate-300 mt-1">{inc.description}</p>

                    {inc.resolution_notes && (
                      <div className="mt-3 p-2.5 rounded bg-navy-850 border border-slate-800 text-slate-300">
                        <span className="font-semibold text-emerald-400 block mb-0.5">Staff Resolution Notes:</span>
                        {inc.resolution_notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Immutable Transaction Audit Timeline */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-teal-400" />
              Immutable Audit Log & Lifecycle Timeline
            </h2>

            <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
              {auditLogs.length === 0 ? (
                <p className="text-xs text-slate-400">No events logged yet.</p>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="relative group">
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-cyan-500 border-4 border-navy-900" />

                    <div className="text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white capitalize">
                          {log.action.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400">{formatDateTime(log.created_at)}</span>
                      </div>

                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Actor: <span className="text-slate-300 font-medium">{log.actor?.display_name || 'System / Staff'}</span>
                      </p>

                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <pre className="mt-2 p-2 rounded bg-navy-850 border border-slate-800 text-[10px] text-slate-300 overflow-x-auto font-mono">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 4 cols: Verification QR & Handover Card */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center justify-center gap-1.5 mb-4">
              <QrCode className="w-4 h-4" />
              Digital Handover Token
            </span>

            {qrCodeDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrCodeDataUrl}
                alt="Booking Handover QR"
                className="w-36 h-36 mx-auto rounded-xl bg-navy-950 p-2 border border-cyan-800/60 shadow-lg"
              />
            ) : null}

            <p className="text-xs text-slate-300 mt-4 font-semibold">Show at Laboratory Counter</p>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Lab managers scan this token to verify authorized identity, match serial numbers, and sign off the condition report.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 text-xs text-slate-300 space-y-3">
            <h3 className="font-bold text-white text-sm">Policy Reminders</h3>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Inspection photos are required prior to handover departure.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Report any component irregularities immediately to avoid liability.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
