import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats integer paise into INR representation.
 * e.g., 0 -> "Free", 5000 -> "₹50.00", 200000 -> "₹2,000.00"
 */
export function formatCurrency(paise: number, zeroIsFree = true): string {
  if (paise === 0 && zeroIsFree) {
    return 'Free';
  }
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: rupees % 1 === 0 ? 0 : 2,
  }).format(rupees);
}

export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function getStatusBadge(status: string): { label: string; bg: string; text: string; border: string } {
  switch (status) {
    case 'active':
    case 'approved':
    case 'verified':
    case 'available':
      return { label: status.toUpperCase(), bg: 'bg-emerald-950/60', text: 'text-emerald-400', border: 'border-emerald-800/80' };
    case 'checked_out':
      return { label: 'CHECKED OUT', bg: 'bg-cyan-950/60', text: 'text-cyan-400', border: 'border-cyan-800/80' };
    case 'pending':
    case 'waitlisted':
      return { label: status.toUpperCase(), bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-800/80' };
    case 'completed':
      return { label: 'COMPLETED', bg: 'bg-blue-950/60', text: 'text-blue-400', border: 'border-blue-800/80' };
    case 'incident_review':
    case 'damaged':
    case 'rejected':
    case 'suspended':
      return { label: status.replace('_', ' ').toUpperCase(), bg: 'bg-rose-950/60', text: 'text-rose-400', border: 'border-rose-800/80' };
    case 'cancelled':
      return { label: 'CANCELLED', bg: 'bg-slate-800/60', text: 'text-slate-400', border: 'border-slate-700' };
    default:
      return { label: status.toUpperCase(), bg: 'bg-slate-800/60', text: 'text-slate-300', border: 'border-slate-700' };
  }
}
