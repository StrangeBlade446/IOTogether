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
    <html lang="en" className="dark">
      <body className="bg-[#141821] text-[#F1E7D0] flex flex-col min-h-screen antialiased selection:bg-[#C49A55]/30 selection:text-[#F1E7D0] font-sans relative">
        {/* ========================================================================= */}
        {/* ROTATED BACKGROUND ARTWORK (LANDSCAPE 16:9) WITH NOCTURNAL GRADIENT */}
        {/* ========================================================================= */}
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none select-none"
        >
          {/* Rotated background artwork */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen scale-105 filter saturate-125"
            style={{ backgroundImage: `url('/background.jpg')` }}
          />
          {/* Theme overlays for readability and contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#141821]/80 via-[#141821]/90 to-[#141821] backdrop-blur-[1px]" />
          <div className="absolute inset-0 blueprint-grid opacity-25" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#C49A55]/15 via-[#67C7D4]/10 to-transparent blur-3xl rounded-full" />
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
