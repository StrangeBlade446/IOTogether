'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import {
  QrCode,
  CheckCircle2,
  ShieldCheck,
  X,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface SeekerReturnQrModalProps {
  bookingId: string;
  returnToken: string;
  resourceName: string;
  borrowerName: string;
  onClose?: () => void;
}

export function SeekerReturnQrModal({
  bookingId,
  returnToken,
  resourceName,
  borrowerName,
  onClose,
}: SeekerReturnQrModalProps) {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (returnToken) {
      QRCode.toDataURL(returnToken, {
        width: 320,
        margin: 3,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
        .then((url) => setDataUrl(url))
        .catch((err) => console.error('Error generating Return QR:', err));
    }
  }, [returnToken]);

  const copyToken = () => {
    navigator.clipboard.writeText(returnToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const keeperVerifyUrl = `/sender/loans?returnBookingId=${bookingId}&returnToken=${encodeURIComponent(returnToken)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300 mb-2 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Equipment Return Authorization
          </div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Present Return QR to Lab Head</h2>
          <p className="text-xs text-slate-700 mt-1">
            Show this Return QR code to the Keeper at the laboratory counter. The booking completes once scanned and manually verified.
          </p>
        </div>

        {/* Equipment Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-700">
            <span className="text-slate-500">Equipment:</span>
            <span className="font-bold text-slate-950">{resourceName}</span>
          </div>
          <div className="flex justify-between text-slate-700">
            <span className="text-slate-500">Borrower:</span>
            <span className="font-semibold text-slate-900">{borrowerName}</span>
          </div>
          <div className="flex justify-between text-slate-700">
            <span className="text-slate-500">Return Requirement:</span>
            <span className="font-bold text-emerald-700">Must be scanned & manually verified by Keeper</span>
          </div>
        </div>

        {/* QR Code Presentation */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-100 rounded-2xl border border-slate-200 mb-4 shadow-inner">
          {dataUrl ? (
            <img src={dataUrl} alt="Return QR Code" className="w-60 h-60 object-contain rounded-xl bg-white p-2 shadow-sm" />
          ) : (
            <div className="w-60 h-60 flex items-center justify-center text-slate-500">
              <QrCode className="w-12 h-12 animate-pulse" />
            </div>
          )}
          <span className="mt-3 text-[11px] font-mono font-bold text-slate-800 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
            SCAN ON KEEPER DESK TO COMPLETE
          </span>
        </div>

        {/* Token Fallback */}
        <div className="flex items-center justify-between gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs mb-4">
          <div className="truncate font-mono text-[11px] text-slate-600">
            Token: <span className="text-emerald-700 font-bold">{returnToken}</span>
          </div>
          <button
            onClick={copyToken}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-semibold transition shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        {/* 1-Click Evaluator Action */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <Link
            href={keeperVerifyUrl}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Open Keeper Desk to Scan &amp; Complete Return</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
