import type { Metadata } from 'next';
import './globals.css';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import { SideDock } from '@/components/navigation/SideDock';
import { Footer } from '@/components/navigation/Footer';
import { MainLayoutWrapper } from '@/components/navigation/MainLayoutWrapper';

export const metadata: Metadata = {
  title: 'IOTogether — Multi-Institution Electronics Resource-Sharing Platform',
  description:
    'Connect schools, colleges, laboratories, and makerspaces to share underused electronics equipment with verified students and makers.',
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
      <body className="bg-[#F8FAFC] text-[#0F172A] flex flex-col min-h-screen antialiased selection:bg-[#C49A55]/25 selection:text-[#0F172A] font-sans relative">
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

        {/* Side Dock Navigation (hidden on landing page, shown after login / on inner pages) */}
        <SideDock unreadNotifs={unreadNotifs} />

        {/* Dynamic Main Content Wrapper with route-aware padding */}
        <MainLayoutWrapper>{children}</MainLayoutWrapper>

        <Footer />
      </body>
    </html>
  );
}
