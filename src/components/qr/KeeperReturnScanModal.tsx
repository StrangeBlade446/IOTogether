'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
import {
  QrCode,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Sparkles,
  RefreshCw,
  Upload,
  VideoOff,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { completeReturnWithQrAction } from '@/app/actions/booking';

interface KeeperReturnScanModalProps {
  bookingId: string;
  resourceName: string;
  borrowerName: string;
  expectedReturnToken?: string;
  onSuccess: () => void;
  onClose: () => void;
}

export function KeeperReturnScanModal({
  bookingId,
  resourceName,
  borrowerName,
  expectedReturnToken,
  onSuccess,
  onClose,
}: KeeperReturnScanModalProps) {
  const [tokenInput, setTokenInput] = useState(expectedReturnToken || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');
  const [scannedResult, setScannedResult] = useState<string | null>(expectedReturnToken || null);
  const [condition, setCondition] = useState<'good' | 'fair' | 'poor' | 'damaged'>('good');
  const [inspectionNotes, setInspectionNotes] = useState('Physical return inspection passed. All components present and undamaged.');
  const [checksPassed, setChecksPassed] = useState({
    powerCheck: true,
    componentsPresent: true,
    idVerified: true,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const handleCompleteReturn = async (tokenToUse?: string) => {
    const token = (tokenToUse || scannedResult || tokenInput).trim();
    if (!token) {
      setError('Please scan or enter the borrower Return QR code first.');
      return;
    }

    setSubmitting(true);
    setError(null);
    stopCamera();

    try {
      const res = await completeReturnWithQrAction({
        bookingId,
        scannedReturnQr: token,
        condition: condition === 'damaged' ? 'damaged' : 'good',
        notes: inspectionNotes,
        isIncident: condition === 'damaged',
        incidentType: condition === 'damaged' ? 'damage' : undefined,
        incidentDescription: condition === 'damaged' ? inspectionNotes : undefined,
      });

      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || 'Failed to complete return verification');
      }
    } catch (err: any) {
      setError(err?.message || 'Error processing return');
    } finally {
      setSubmitting(false);
    }
  };

  // Video frame scanner
  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data) {
        const found = code.data.trim();
        setScannedResult(found);
        setTokenInput(found);
        stopCamera();
        return;
      }
    }

    animFrameRef.current = requestAnimationFrame(scanFrame);
  }, [stopCamera]);

  const startCamera = async () => {
    setError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraPermission('unsupported');
      setError('Webcam scanner is not supported on this device/browser. Please use token input.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });

      streamRef.current = stream;
      setCameraActive(true);
      setCameraPermission('granted');

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play().then(() => {
          animFrameRef.current = requestAnimationFrame(scanFrame);
        });
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraPermission('denied');
      setError('Camera access denied or unavailable. You can enter the Return token below or use instant verification.');
      setCameraActive(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            setScannedResult(code.data.trim());
            setTokenInput(code.data.trim());
          } else {
            setError('Could not read a valid QR code from this image. Please enter the token manually.');
          }
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const isQrVerified = Boolean(scannedResult || tokenInput.length > 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300 mb-2 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Keeper Return Inspection Protocol
          </div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Scan Return QR &amp; Manual Verify</h2>
          <p className="text-xs text-slate-700 mt-1">
            Scan the Return QR presented by <strong>{borrowerName}</strong>, inspect the physical condition, and click Manual Verified to complete this loan.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: SCAN RETURN QR CODE */}
        <div className="mb-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-mono">
              <QrCode className="w-4 h-4 text-emerald-700" />
              STEP 1: SCAN BORROWER RETURN QR CODE
            </span>
            {isQrVerified ? (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" /> Verified
              </span>
            ) : (
              <span className="text-[10px] text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full font-mono">
                Required
              </span>
            )}
          </div>

          {/* Camera Scanner View */}
          {cameraActive ? (
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video mb-3 border border-emerald-500">
              <video ref={videoRef} className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 border-2 border-emerald-400/60 rounded-xl pointer-events-none animate-pulse" />
              <button
                type="button"
                onClick={stopCamera}
                className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-black/70 hover:bg-black text-white text-[10px] font-semibold flex items-center gap-1"
              >
                <VideoOff className="w-3 h-3" /> Stop Camera
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <button
                type="button"
                onClick={startCamera}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
              >
                <Camera className="w-4 h-4" /> Start Camera Scanner
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs transition flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" /> Upload QR Image
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

              {expectedReturnToken && (
                <button
                  type="button"
                  onClick={() => {
                    setScannedResult(expectedReturnToken);
                    setTokenInput(expectedReturnToken);
                  }}
                  className="px-3 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-800 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600" /> Auto-Fill Seeker QR Token
                </button>
              )}
            </div>
          )}

          {/* Scanned Result or Token Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => {
                setTokenInput(e.target.value);
                setScannedResult(e.target.value);
              }}
              placeholder="e.g. IOT-RETURN:06c8e46a-...:WS65S5XR"
              className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* STEP 2: MANUAL PHYSICAL CONDITION VERIFICATION */}
        <div className="mb-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            STEP 2: MANUAL PHYSICAL CONDITION CHECKLIST
          </span>

          <div className="space-y-2 text-xs text-slate-800">
            <label className="flex items-center gap-2 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={checksPassed.powerCheck}
                onChange={(e) => setChecksPassed((p) => ({ ...p, powerCheck: e.target.checked }))}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Power-on test passed (Microcontroller/sensor powers on with steady LED)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={checksPassed.componentsPresent}
                onChange={(e) => setChecksPassed((p) => ({ ...p, componentsPresent: e.target.checked }))}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>All accessories, cables, jumper wires & packaging returned</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={checksPassed.idVerified}
                onChange={(e) => setChecksPassed((p) => ({ ...p, idVerified: e.target.checked }))}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Physical ID matches returning student ({borrowerName})</span>
            </label>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Equipment Condition:</label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setCondition('good')}
                className={`py-1.5 px-2 rounded-lg font-bold border transition text-center ${
                  condition === 'good'
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-400 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                Good / Pristine
              </button>

              <button
                type="button"
                onClick={() => setCondition('fair')}
                className={`py-1.5 px-2 rounded-lg font-bold border transition text-center ${
                  condition === 'fair'
                    ? 'bg-amber-100 text-amber-950 border-amber-400 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                Minor Wear
              </button>

              <button
                type="button"
                onClick={() => setCondition('damaged')}
                className={`py-1.5 px-2 rounded-lg font-bold border transition text-center ${
                  condition === 'damaged'
                    ? 'bg-rose-100 text-rose-950 border-rose-400 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                Damaged / Review
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Inspection Notes:</label>
            <input
              type="text"
              value={inspectionNotes}
              onChange={(e) => setInspectionNotes(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* STEP 3: CONFIRM & COMPLETE BUTTON */}
        <div className="space-y-2">
          <button
            type="button"
            disabled={submitting || !isQrVerified}
            onClick={() => handleCompleteReturn()}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 group"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
            )}
            <span>
              {submitting
                ? 'Verifying Return...'
                : 'Manual Verified — Confirm Return & Complete Booking'}
            </span>
          </button>

          {!isQrVerified && (
            <p className="text-[11px] text-amber-700 text-center font-mono">
              * Return QR Code must be scanned above before completing return.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
