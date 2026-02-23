'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { QuizSession } from '@/types';
import { CertificateDisplay } from '@/components/CertificateDisplay';
import html2canvas from 'html2canvas';

export default function CertificatePage() {
  const router = useRouter();
  const certificateRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [scale, setScale] = useState(1);
  const [showLinkedInBanner, setShowLinkedInBanner] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('quizSession');
    if (!stored) { router.push('/'); return; }
    const sessionData = JSON.parse(stored) as QuizSession;
    if (!sessionData.aiProfile) { router.push('/quiz'); return; }
    setSession(sessionData);
    setIsLoading(false);
    saveSession(sessionData).catch(console.error);
  }, [router]);

  // Scale certificate to fit container — recalculate on load & resize
  useEffect(() => {
    if (isLoading) return;
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setScale(Math.min(1, w / 1000));
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [isLoading]);

  const saveSession = async (data: QuizSession) => {
    try {
      await fetch('/api/save-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) { console.error(e); }
  };

  const generateCertificateImage = useCallback(async (): Promise<string | null> => {
    if (!certificateRef.current) return null;
    const canvas = await html2canvas(certificateRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    return canvas.toDataURL('image/png');
  }, []);

  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const dataUrl = await generateCertificateImage();
      if (dataUrl) downloadImage(dataUrl, `AI-Certificate-${session?.name || 'certificate'}.png`);
    } catch (e) { console.error(e); }
    finally { setIsDownloading(false); }
  };

  const handleShareLinkedIn = async () => {
    if (!session) return;
    setIsSharing(true);
    try {
      // Auto-download certificate first
      const dataUrl = await generateCertificateImage();
      if (dataUrl) downloadImage(dataUrl, `AI-Certificate-${session.name || 'certificate'}.png`);

      // Open LinkedIn with pre-filled text
      const text = `I just completed an AI Sense Check — a quick reflection on how I interpret AI decisions in real work situations.

My result: ${session.aiProfile}

It's a good reminder that AI success depends on people and context, not just features.

Curious about yours? Try it here: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://areyou-ai-ready.vercel.app'}

Drop your profile below.`;

      window.open(
        `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`,
        '_blank'
      );

      // Record LinkedIn click in session and update Sheets
      const updatedSession = { ...session, linkedInClicked: true };
      setSession(updatedSession);
      localStorage.setItem('quizSession', JSON.stringify(updatedSession));
      saveSession(updatedSession).catch(console.error);

      setShowLinkedInBanner(true);
    } catch (e) { console.error(e); }
    finally { setIsSharing(false); }
  };

  if (isLoading || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f0eb]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB]" />
          <p className="mt-3 text-gray-500 text-sm">Loading your certificate…</p>
        </div>
      </div>
    );
  }

  const certHeight = Math.round(630 * scale);
  const certWidth = Math.round(1000 * scale);

  return (
    <div className="min-h-screen bg-[#f5f0eb] flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl">

        {/* LinkedIn banner */}
        {showLinkedInBanner && (
          <div className="mb-6 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <span className="text-blue-500 text-base mt-0.5">📎</span>
            <p className="text-blue-700 text-sm flex-1">
              Certificate downloaded! In LinkedIn, click the <strong>image icon</strong> to attach it before posting.
            </p>
            <button onClick={() => setShowLinkedInBanner(false)} className="text-blue-400 hover:text-blue-600 text-lg leading-none">×</button>
          </div>
        )}

        {/* Certificate display — centered, clips to exact visual size */}
        <div
          ref={containerRef}
          className="w-full mb-8"
        >
          {/* Hidden full-size element for html2canvas */}
          <div style={{ position: 'fixed', left: '-9999px', top: '-9999px', pointerEvents: 'none' }} aria-hidden="true">
            {session.aiProfile && (
              <CertificateDisplay
                ref={certificateRef}
                name={session.name || 'Certificate User'}
                profile={session.aiProfile}
                certificateId={session.certificateId || 'ASC-XXXXXXXX'}
              />
            )}
          </div>

          {/* Visible scaled version — centered */}
          <div
            style={{
              width: `${certWidth}px`,
              height: `${certHeight}px`,
              margin: '0 auto',
              overflow: 'hidden',
              borderRadius: '12px',
            }}
          >
            <div style={{ width: '1000px', transform: `scale(${scale})`, transformOrigin: 'top left' }}>
              {session.aiProfile && (
                <CertificateDisplay
                  name={session.name || 'Certificate User'}
                  profile={session.aiProfile}
                  certificateId={session.certificateId || 'ASC-XXXXXXXX'}
                />
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-6 py-3 bg-[#1a1a2e] text-white font-semibold rounded-xl text-sm hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDownloading ? (
              <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Downloading…</>
            ) : '⬇ Download Certificate'}
          </button>

          <button
            onClick={handleShareLinkedIn}
            disabled={isSharing}
            className="px-6 py-3 bg-[#0A66C2] text-white font-semibold rounded-xl text-sm hover:bg-[#004182] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSharing ? (
              <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Preparing…</>
            ) : (
              <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>Share on LinkedIn</>
            )}
          </button>

          <button
            onClick={() => { localStorage.removeItem('quizSession'); router.push('/'); }}
            className="px-6 py-3 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-100 transition-colors"
          >
            ↺ Retake Quiz
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Tip: &ldquo;Share on LinkedIn&rdquo; auto-downloads your certificate — attach it to the post using the image icon.
        </p>
      </div>
    </div>
  );
}
