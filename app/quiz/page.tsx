'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Question, UserAnswer, QuizSession } from '@/types';
import { getRevealForDomain } from '@/data/reveals';
import { assignUserProfile } from '@/lib/profileLogic';
import { getUserGeography } from '@/lib/ipGeolocation';
import { nanoid } from 'nanoid';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizPage() {
  const router = useRouter();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [questionKey, setQuestionKey] = useState(0); // drives re-mount animation

  useEffect(() => {
    const stored = localStorage.getItem('quizSession');
    if (!stored) { router.push('/'); return; }
    setSession(JSON.parse(stored));
    setIsLoading(false);
  }, [router]);

  const currentQuestion: Question | undefined = session?.questions[currentQuestionIndex];

  const handleSelectAnswer = (optionId: string) => {
    if (showReveal) return;
    setSelectedAnswerId(optionId);
    setShowReveal(true);
  };

  const handleNext = async () => {
    if (!session || !currentQuestion || !selectedAnswerId) return;
    const selectedOption = currentQuestion.options.find(o => o.id === selectedAnswerId);

    const newAnswer: UserAnswer = selectedOption
      ? { questionId: currentQuestion.id, selectedOptionId: selectedAnswerId, signals: selectedOption.signals }
      : { questionId: currentQuestion.id, selectedOptionId: selectedAnswerId, signals: [] };

    const updatedAnswers = [...answers, newAnswer];

    if (currentQuestionIndex === 7) {
      const { profile } = assignUserProfile(updatedAnswers);
      const geography = await getUserGeography();
      const completedSession: QuizSession = {
        ...session,
        answers: updatedAnswers,
        aiProfile: profile,
        certificateId: `ASC-${nanoid(8).toUpperCase()}`,
        geography,
      };
      localStorage.setItem('quizSession', JSON.stringify(completedSession));
      router.push('/certificate');
    } else {
      // Animate out, then switch question
      setShowReveal(false);
      setSelectedAnswerId(null);
      // Small delay so the collapse animation plays before the new question fades in
      setTimeout(() => {
        setCurrentQuestionIndex(i => i + 1);
        setQuestionKey(k => k + 1);
        setAnswers(updatedAnswers);
      }, 80);
    }
  };

  if (isLoading || !session || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f0eb]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB]" />
          <p className="mt-3 text-gray-500 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  const selectedOption = currentQuestion.options.find(o => o.id === selectedAnswerId);
  const reveal = selectedOption ? getRevealForDomain(currentQuestion.domain, selectedOption.signals) : null;
  const revealText = reveal
    ? `${reveal.encouragement} ${reveal.rationale} ${reveal.context}`
    : null;

  return (
    <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center px-6 py-12">

      {/* Outer wrapper expands smoothly when reveal opens */}
      <div
        className="w-full"
        style={{
          maxWidth: showReveal ? '980px' : '680px',
          transition: 'max-width 0.25s ease-out',
        }}
      >

        {/* ── Header: badge + progress — always full width ── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-gray-500 border border-gray-300 rounded-full px-4 py-1.5 bg-white">
              AI Sense Check
            </span>
            <span className="text-sm font-medium text-gray-400">
              {currentQuestionIndex + 1} / 8
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-[3px]">
            <div
              className="bg-[#2563EB] h-[3px] rounded-full"
              style={{
                width: `${((currentQuestionIndex + 1) / 8) * 100}%`,
                transition: 'width 0.4s ease-out',
              }}
            />
          </div>
        </div>

        {/* ── Main content: single → two-column on reveal ── */}
        <div
          className={showReveal ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : ''}
        >

          {/* ── Left: Scenario + Options ── */}
          <div key={questionKey} className="animate-question">

            {/* Scenario card */}
            <div className="bg-white rounded-2xl px-7 py-7 mb-4 shadow-sm border border-gray-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB] mb-3">
                Scenario
              </p>
              <p className="text-[#1a1a2e] text-[17px] font-semibold leading-relaxed">
                {currentQuestion.scenario}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswerId === option.id;
                const isDimmed = showReveal && !isSelected;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectAnswer(option.id)}
                    disabled={showReveal}
                    style={{ transition: 'opacity 0.12s ease-out, border-color 0.12s ease-out, background-color 0.12s ease-out' }}
                    className={`w-full flex items-start gap-4 px-5 py-4 rounded-xl border-2 text-left ${
                      isSelected
                        ? 'border-[#2563EB] bg-white'
                        : isDimmed
                        ? 'border-gray-200 bg-white opacity-25'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span
                      style={{ transition: 'background-color 0.12s ease-out, border-color 0.12s ease-out' }}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        isSelected ? 'border-[#2563EB] bg-[#2563EB]' : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected ? (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-400">{OPTION_LABELS[idx]}</span>
                      )}
                    </span>
                    <p className={`text-[15px] leading-snug ${
                      isSelected ? 'text-[#1a1a2e] font-semibold' : 'text-gray-600'
                    }`}>
                      {option.text}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Right: Reveal card + Next button — slides in from right ── */}
          {showReveal && revealText && (
            <div className="flex flex-col gap-4 mt-4 md:mt-0 animate-reveal">
              <div className="bg-white border border-gray-100 rounded-2xl px-7 py-7 shadow-sm flex-1">
                <p className="text-[#1a1a2e] text-[15px] leading-[1.85]">
                  {revealText}
                </p>
              </div>
              <button
                onClick={handleNext}
                className="w-full py-4 bg-[#2563EB] text-white font-semibold rounded-xl text-[15px] hover:bg-[#1d4ed8] transition-colors duration-150"
              >
                {currentQuestionIndex === 7 ? 'See Your Profile →' : 'Next Question →'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
