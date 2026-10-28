import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showTagline = false, className = '' }: LogoProps) {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
      {/* Circuit Nodes Icon */}
      <div className={`relative flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 text-navy-950 p-1.5 shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all ${iconSizes[size]}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-white">
          {/* Central IC/Microchip Body */}
          <rect x="5" y="5" width="14" height="14" rx="2.5" className="fill-navy-900/40" />
          {/* Circuit Pins & Connectivity Traces */}
          <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
          {/* Interconnected Nodes */}
          <circle cx="9" cy="9" r="1.5" className="fill-cyan-300" />
          <circle cx="15" cy="15" r="1.5" className="fill-teal-300" />
          <path d="M10.5 10.5l3 3" strokeWidth="1.8" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className={`font-bold tracking-tight text-white flex items-center ${textSizes[size]}`}>
          <span>IO</span>
          <span className="text-cyan-400">Together</span>
        </div>
        {showTagline && (
          <span className="text-[10px] tracking-wider uppercase text-cyan-200/70 font-medium">
            Share Resources. Build Possibilities.
          </span>
        )}
      </div>
    </Link>
  );
}
