import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StudioGearHub - Home Studio Equipment Database & Comparison Tool',
  description: 'Compare thousands of studio equipment pieces and discover the gear that matches your sound, budget, and workflow.',
  keywords: 'studio equipment, audio interfaces, microphones, studio monitors, music production, home studio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}