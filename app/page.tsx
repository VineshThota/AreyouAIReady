'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';

export default function LandingPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty }),
      });
      if (!response.ok) throw new Error('Failed to generate questions');
      const { questions } = await response.json();
      localStorage.setItem(
        'quizSession',
        JSON.stringify({
          sessionId: nanoid(),
          name: name.trim() || 'Anonymous',
          email: email.trim() || null,
          difficulty,
          questions,
          answers: [],
          createdAt: new Date().toISOString(),
        })
      );
      router.push('/quiz');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center px-8 py-16">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-16 items-center">

        {/* ── Left column ── */}
        <div>
          <span className="inline-block text-xs font-medium text-gray-500 border border-gray-300 rounded-full px-4 py-1.5 bg-white mb-10">
            AI Sense Check
          </span>

          <h1 className="font-serif text-[56px] font-bold text-[#1a1a2e] leading-[1.1] mb-4">
            Are You AI-Ready?
          </h1>
          <h2 className="font-serif text-[56px] font-bold text-gray-400 leading-[1.1] mb-9">
            Check Your AI<br />Sense Here.
          </h2>

          <p className="text-gray-500 text-[15px] leading-[1.8] mb-11 max-w-[380px]">
            Most AI conversations focus on models and tools. This short interactive check explores how you interpret AI decisions in real workplace situations.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <svg className="w-[18px] h-[18px] text-[#1a1a2e] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="text-[15px] font-semibold text-[#1a1a2e] mb-1">Discover Your Profile</p>
                <p className="text-sm text-gray-400 leading-relaxed">Are you a Systems Thinker, Adoption Realist, or Workflow Optimizer?</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <svg className="w-[18px] h-[18px] text-[#1a1a2e] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="text-[15px] font-semibold text-[#1a1a2e] mb-1">Earn Your Certificate</p>
                <p className="text-sm text-gray-400 leading-relaxed">Receive a professional, shareable certificate for your LinkedIn profile.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right column — form card ── */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">

          <div className="mb-7">
            <h3 className="text-[22px] font-semibold text-[#1a1a2e] mb-1.5">Begin the check</h3>
            <p className="text-sm text-gray-400">Takes roughly two minutes to complete.</p>
          </div>

          <div className="space-y-5">

            {/* Name */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Your Name</label>
                <span className="text-xs text-gray-400">Optional</span>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Chen"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <span className="text-xs text-gray-400">Optional</span>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Share your email to receive a deeper insights summary after completion.
              </p>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-100" />

            {/* Focus Area */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">
                  Select Focus Area <span className="text-red-400 ml-0.5">*</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {(['easy', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-3.5 px-4 rounded-xl border-2 text-left transition-all duration-150 ${
                      difficulty === d
                        ? 'border-[#2563EB] bg-white'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <p className="font-semibold text-sm text-[#1a1a2e]">
                        {d === 'easy' ? 'Easy' : 'Hard'}
                      </p>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-2 transition-all duration-150 ${
                        difficulty === d ? 'border-[#2563EB] bg-[#2563EB]' : 'border-gray-300 bg-white'
                      }`}>
                        {difficulty === d && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-snug pr-1">
                      {d === 'easy' ? 'Email, meetings, and personal productivity.' : 'Decision systems, workflows, and edge cases.'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              onClick={handleStart}
              disabled={isLoading}
              className="w-full py-4 bg-[#2563EB] text-white font-semibold rounded-xl text-sm hover:bg-[#1d4ed8] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating quiz…
                </>
              ) : (
                'I am ready for some AI stuff'
              )}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
