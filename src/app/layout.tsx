import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';

export const metadata: Metadata = {
  title: 'IOTogether — Multi-Institution Electronics Resource-Sharing Platform',
  description: 'Connect schools, colleges, laboratories, and makerspaces to share underused electronics equipment with verified students and makers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#141821] text-[#F1E7D0] flex flex-col min-h-screen antialiased selection:bg-[#C49A55]/30 selection:text-[#F1E7D0] font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
