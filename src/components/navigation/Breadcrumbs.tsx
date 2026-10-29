import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://iotogether.edu');

  const fullItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    ...items,
  ];

  // Schema.org BreadcrumbList
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: fullItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? (item.href.startsWith('http') ? item.href : `${baseUrl}${item.href}`) : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className={`flex items-center text-xs font-mono text-slate-500 ${className}`}>
        <ol className="flex items-center flex-wrap gap-1.5">
          {fullItems.map((item, idx) => {
            const isLast = idx === fullItems.length - 1;
            return (
              <li key={idx} className="flex items-center gap-1.5">
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-slate-900 transition flex items-center gap-1"
                  >
                    {idx === 0 && <Home className="w-3 h-3 text-slate-400" />}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className={`truncate max-w-[240px] sm:max-w-none ${isLast ? 'text-slate-900 font-semibold' : ''}`}>
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
