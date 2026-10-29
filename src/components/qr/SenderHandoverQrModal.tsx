'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, CheckCircle2, ShieldCheck, X, Copy, Check } from 'lucide-react';

interface SenderHandoverQrModalProps {
  bookingId: string;
  qrToken: string;
  resourceName: string;
  borrowerName: string;
  borrowerPost?: string;
  borrowerInstitute?: string;
  durationText?: string;
  onClose?: () => void;
}

export function SenderHandoverQrModal({
  bookingId,
  qrToken,
  resourceName,
  borrowerName,
  borrowerPost,
  borrowerInstitute,
  durationText,
  onClose,
}: SenderHandoverQrModalProps) {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (qrToken) {
      QRCode.toDataURL(qrToken, {
        width: 320,
        margin: 3,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
        .then((url) => setDataUrl(url))
        .catch((err) => console.error('Error generating QR:', err));
    }
  }, [qrToken]);

  const copyToken = () => {
    navigator.clipboard.writeText(qrToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl shadow-cyan-950/60">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-2">
            <ShieldCheck className="w-4 h-4" /> Lab Head Verified Handover QR
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Display to Receiver</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Receiver must scan this QR code on their device to complete physical checkout and activate the countdown timer.
          </p>
        </div>

        {/* Receiver Verification Summary */}
        <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-3 mb-4 text-xs space-y-1">
          <div className="flex justify-between text-neutral-300">
            <span className="text-neutral-500">Authorized Receiver:</span>
            <span className="font-semibold text-white">{borrowerName}</span>
          </div>
          {borrowerPost && (
            <div className="flex justify-between text-neutral-300">
              <span className="text-neutral-500">Post / Designation:</span>
              <span className="font-medium text-cyan-300">{borrowerPost}</span>
            </div>
          )}
          {borrowerInstitute && (
            <div className="flex justify-between text-neutral-300">
              <span className="text-neutral-500">Institution:</span>
              <span className="text-neutral-300">{borrowerInstitute}</span>
            </div>
          )}
          <div className="flex justify-between text-neutral-300">
            <span className="text-neutral-500">Equipment:</span>
            <span className="font-semibold text-white">{resourceName}</span>
          </div>
          {durationText && (
            <div className="flex justify-between text-neutral-300">
              <span className="text-neutral-500">Approved Duration:</span>
              <span className="text-amber-400 font-medium">{durationText}</span>
            </div>
          )}
        </div>

        {/* QR Code Presentation */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-inner mb-4">
          {dataUrl ? (
            <img src={dataUrl} alt="Handover QR Code" className="w-64 h-64 object-contain rounded-lg" />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center text-neutral-500">
              <QrCode className="w-12 h-12 animate-pulse" />
            </div>
          )}
          <span className="mt-2 text-[11px] font-mono text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
            SCAN WITH RECEIVER CAMERA OR APP
          </span>
        </div>

        {/* Token Manual Fallback */}
        <div className="flex items-center justify-between gap-2 p-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs">
          <div className="truncate font-mono text-[11px] text-neutral-400">
            Token: <span className="text-cyan-400">{qrToken}</span>
          </div>
          <button
            onClick={copyToken}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium transition shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-1.5 text-green-400 font-medium">
            <CheckCircle2 className="w-4 h-4" /> Ready for scan
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
