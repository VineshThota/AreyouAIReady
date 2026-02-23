import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Are You AI Ready? | AI Sense Check',
  description: 'A short interactive check that explores how AI actually works in real environments. Takes two minutes and gives you a shareable AI thinking profile.',
  openGraph: {
    title: 'How AI-Savvy Is Your Thinking at Work?',
    description: 'A short interactive check that explores how AI actually works in real environments. Takes two minutes and gives you a shareable AI thinking profile.',
    type: 'website',
    siteName: 'Are You AI Ready?',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white font-sans">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
