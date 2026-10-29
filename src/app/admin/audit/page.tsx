import React from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import { formatDateTime } from '@/lib/utils';
import { ArrowLeft, Clock, ShieldAlert, FileText, Building, User } from 'lucide-react';

export const revalidate = 0;

export default async function AdminAuditLogPage() {
  const session = await getSession();

  if (!session.isPlatformAdmin && session.managedInstitutions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">Privileged Access Required</h2>
        <p className="text-sm text-slate-400 mt-2">
          Only authorized staff and platform administrators can inspect the append-only audit ledger.
        </p>
      </div>
    );
  }

  const logs = db.getAuditLogs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Admin Console
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <FileText className="w-8 h-8 text-teal-600" />
          Append-Only Platform Audit Ledger
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Cryptographically aligned, non-repudiable audit logs recording equipment reservations, staff checkouts, condition sign-offs, and administrative actions.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-sm">
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="p-4 rounded-xl bg-navy-850 border border-slate-800 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    {log.action.replace('_', ' ')}
                  </span>
                  <span className="text-slate-400">Entity: <strong className="text-white">{log.entity_type}</strong></span>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {log.entity_id.slice(0, 8)}...</span>
                </div>

                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {formatDateTime(log.created_at)}
                </span>
              </div>

              <div className="flex items-center gap-4 text-slate-300 text-[11px] mb-2">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-cyan-400" />
                  Actor: <strong className="text-white">{log.actor?.display_name || 'System / Staff'}</strong>
                </span>
                {log.institution && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <Building className="w-3 h-3" />
                    {log.institution.name}
                  </span>
                )}
              </div>

              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <pre className="mt-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-cyan-300 font-mono overflow-x-auto">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
