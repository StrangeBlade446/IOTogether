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
} from 'lucide-react';
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
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');
  const [scannedResult, setScannedResult] = useState<string | null>(null);

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

  const handleClaim = useCallback(
    async (tokenToUse?: string) => {
      const token = (tokenToUse || tokenInput).trim();
      if (!token) {
        setError('Please scan or enter the Lab Head handover QR code');
        return;
      }

      setSubmitting(true);
      setError(null);
      stopCamera();

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
    },
    [bookingId, tokenInput, stopCamera, onSuccess]
  );

  // Frame scanner loop using jsQR
  const scanFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data) {
          // Found QR Code!
          setScannedResult(code.data);
          setTokenInput(code.data);
          stopCamera();
          handleClaim(code.data);
          return;
        }
      }
    }

    animFrameRef.current = requestAnimationFrame(scanFrame);
  }, [handleClaim, stopCamera]);

  // Start real camera stream
  const startCamera = useCallback(async () => {
    setError(null);
    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraPermission('unsupported');
      return;
    }

    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }

      setCameraActive(true);
      setCameraPermission('granted');
      animFrameRef.current = requestAnimationFrame(scanFrame);
    } catch (err: any) {
      console.warn('Camera access unavailable or denied:', err);
      setCameraPermission('denied');
      setCameraActive(false);
      setError('Camera access is not permitted or no camera found. You can upload a photo of the QR code or paste the token.');
    }
  }, [scanFrame, stopCamera]);

  // Auto-launch camera when modal opens
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Decode QR from uploaded image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          setScannedResult(code.data);
          setTokenInput(code.data);
          handleClaim(code.data);
        } else {
          setError('Could not detect a valid QR code in the uploaded image.');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
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
            Hold your camera up to the QR code on the Lab Head&apos;s screen to complete physical handover and activate your live timer.
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-950/50 border border-red-700/60 text-xs text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Real Live Camera Viewfinder & jsQR Scanner */}
        <div className="relative overflow-hidden rounded-xl border border-neutral-700 bg-neutral-950 text-center mb-4 min-h-[240px] flex items-center justify-center">
          {/* Hidden Canvas for Frame Analysis */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Live Video Element */}
          <video
            ref={videoRef}
            className={`w-full h-64 object-cover ${cameraActive ? 'block' : 'hidden'}`}
            muted
            playsInline
          />

          {/* Scanning Reticle & Animated Laser Line */}
          {cameraActive && (
            <div className="absolute inset-4 border-2 border-cyan-400/70 rounded-xl pointer-events-none flex flex-col justify-between p-2 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
              <div className="flex justify-between">
                <span className="w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                <span className="w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
              </div>

              {/* Animated Laser Scan Bar */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#22d3ee] animate-pulse" />

              <div className="flex justify-between">
                <span className="w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                <span className="w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
              </div>
            </div>
          )}

          {/* Fallback View when Camera is off or unavailable */}
          {!cameraActive && (
            <div className="py-8 px-4 flex flex-col items-center justify-center space-y-3">
              {submitting ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
                  <span className="text-xs text-cyan-300 font-semibold">Verifying handover QR token...</span>
                </div>
              ) : (
                <>
                  <VideoOff className="w-12 h-12 text-neutral-600 mb-1" />
                  <p className="text-xs text-neutral-400">Camera preview inactive</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium shadow-md transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Start Camera
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-slate-200 text-xs font-medium border border-neutral-700 transition"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload QR Image
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>

                  {expectedTokenHint && (
                    <button
                      type="button"
                      onClick={() => {
                        setTokenInput(expectedTokenHint);
                        handleClaim(expectedTokenHint);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600/80 hover:bg-teal-500 text-white text-xs font-medium shadow-md transition mt-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Quick Scan Lab Head Screen
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Scanned Feedback */}
        {scannedResult && (
          <div className="p-2.5 mb-3 rounded-lg bg-emerald-950/70 border border-emerald-500/50 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">QR Code recognized! Starting countdown timer...</span>
          </div>
        )}

        {/* Manual Token Entry Option */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-neutral-300">Or Paste / Type Handover Token</label>
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
