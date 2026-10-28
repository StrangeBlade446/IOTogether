'use client';

import React, { useState } from 'react';
import { QrCode, Camera, CheckCircle2, AlertCircle, Loader2, X, Sparkles } from 'lucide-react';
import { claimHandoverWithQrAction } from '@/app/actions/booking';

interface ReceiverQrScannerModalProps {
  bookingId: string;
  resourceName: string;
  expectedTokenHint?: string;
  onSuccess: (deadlineAt?: string) => void;
  onClose: () => void;
}

export function ReceiverQrScannerModal({
  bookingId,
  resourceName,
  expectedTokenHint,
  onSuccess,
  onClose,
}: ReceiverQrScannerModalProps) {
  const [tokenInput, setTokenInput] = useState(expectedTokenHint || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [simulatingCamera, setSimulatingCamera] = useState(false);

  const handleClaim = async (tokenToUse?: string) => {
    const token = (tokenToUse || tokenInput).trim();
    if (!token) {
      setError('Please scan or enter the Lab Head handover QR code');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await claimHandoverWithQrAction(bookingId, token);
      if (res.success) {
        onSuccess(res.deadlineAt);
      } else {
        setError(res.error || 'Failed to verify handover QR token');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error scanning QR token');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSimulateCameraScan = () => {
    setSimulatingCamera(true);
    setError(null);
    setTimeout(() => {
      setSimulatingCamera(false);
      if (expectedTokenHint) {
        setTokenInput(expectedTokenHint);
        handleClaim(expectedTokenHint);
      } else {
        setError('No QR code detected in simulated camera frame. Please scan or enter code manually.');
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-3">
            <Camera className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Scan Lab Head Handover QR</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Receiving: <span className="text-cyan-300 font-semibold">{resourceName}</span>
          </p>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Scan the QR code displayed on the Lab Head&apos;s screen to confirm physical pickup and activate your countdown timer.
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-950/50 border border-red-700/60 text-xs text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Camera Viewfinder Mock / Scanner UI */}
        <div className="relative overflow-hidden rounded-xl border border-neutral-700 bg-neutral-950 p-6 text-center mb-4">
          <div className="absolute inset-4 border-2 border-dashed border-cyan-500/60 rounded-lg pointer-events-none flex items-center justify-center">
            {simulatingCamera && (
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
            )}
          </div>
          <div className="relative py-8 flex flex-col items-center justify-center">
            {simulatingCamera ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                <span className="text-xs text-cyan-300 font-medium">Scanning Lab Head screen...</span>
              </div>
            ) : (
              <>
                <QrCode className="w-12 h-12 text-neutral-600 mb-2" />
                <p className="text-xs text-neutral-400">Position the QR code within the frame</p>
                <button
                  type="button"
                  onClick={handleSimulateCameraScan}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium shadow-md shadow-cyan-900/40 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Auto-Capture Lab Head QR
                </button>
              </>
            )}
          </div>
        </div>

        {/* Manual Token Entry Option */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-neutral-300">Or Paste Handover Token</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="e.g. IOT-HANDOVER:..."
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleClaim()}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
            >
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              Confirm
            </button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] text-neutral-500 text-center">
          Note: Your Student or Teacher ID was pre-verified. Handover is recorded permanently in the consortium audit log.
        </div>
      </div>
    </div>
  );
}
