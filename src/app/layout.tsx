import type { Metadata } from 'next';
import './globals.css';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import { SideDock } from '@/components/navigation/SideDock';
import { Footer } from '@/components/navigation/Footer';
import { MainLayoutWrapper } from '@/components/navigation/MainLayoutWrapper';
import { OrganizationSchema } from '@/components/seo/OrganizationSchema';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://iotogether.edu');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'IOTogether — Multi-Institution Electronics Resource-Sharing Platform',
    template: '%s | IOTogether',
  },
  description:
    'Inter-collegiate platform connecting engineering universities, schools, and makerspaces to share underutilized microcontrollers, sensors, robotics kits, and laboratory instruments with verified students.',
  keywords: [
    'electronics equipment sharing',
    'academic laboratory consortium',
    'borrow arduino uno',
    'borrow oscilloscope',
    'microcontroller loan college',
    'sensor library university',
    'IOTogether',
    'maker hardware borrowing',
  ],
  authors: [{ name: 'IOTogether Academic Consortium' }],
  creator: 'IOTogether',
  publisher: 'National Electronics Academic Consortium',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'IOTogether — Academic Electronics Resource Sharing Platform',
    description:
      'Connecting colleges and schools possessing underused electronics equipment with verified students and makers seeking hardware.',
    url: siteUrl,
    siteName: 'IOTogether',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IOTogether — Electronics Resource-Sharing Platform',
    description:
      'Connect schools, colleges, laboratories, and makerspaces to share underused electronics equipment.',
    creator: '@IOTogether',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google-site-verification-iotogether-token',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const unreadNotifs = db.getNotifications(session.user.id).filter((n) => !n.read_at).length;

  return (
    <html lang="en" className="light">
      <head>
        <OrganizationSchema />
      </head>
      <body className="bg-[#F8FAFC] text-[#0F172A] flex flex-col min-h-screen antialiased selection:bg-[#C49A55]/25 selection:text-[#0F172A] font-sans relative">
        <GoogleAnalytics />

        {/* ========================================================================= */}
        {/* ROTATED BACKGROUND ARTWORK (LANDSCAPE 16:9) WITH LIGHT AMBIENT GRADIENT */}
        {/* ========================================================================= */}
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none select-none"
        >
          {/* Rotated background artwork */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 scale-105 filter saturate-125 brightness-105"
            style={{ backgroundImage: `url('/background.jpg')` }}
          />
          {/* Theme overlays for readability and light laboratory elegance */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-[#F8FAFC]/85 to-slate-100/90 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 blueprint-grid opacity-30" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#C49A55]/10 via-[#0891B2]/8 to-transparent blur-3xl rounded-full" />
        </div>

        {/* Side Dock Navigation (hidden on landing page, role-filtered for Seeker vs Keeper) */}
        <SideDock unreadNotifs={unreadNotifs} userRole={session.user.platform_role} />

        {/* Dynamic Main Content Wrapper with route-aware padding */}
        <MainLayoutWrapper>{children}</MainLayoutWrapper>

        <Footer />
      </body>
    </html>
  );
}
