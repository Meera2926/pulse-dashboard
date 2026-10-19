import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono  = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400','700'] });

export const metadata: Metadata = {
  title: 'Pulse — Customer Intelligence Hub',
  description: 'Real-time customer event tracking, channel performance and demand forecasting.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(13,13,38,0.95)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#eaeaf8',
              backdropFilter: 'blur(20px)',
              fontFamily: 'var(--font-inter)',
              fontSize: '13px',
            },
          }}
        />
      </body>
    </html>
  );
}
