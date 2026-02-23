import { Signal, UserAnswer, AIThinkingProfile } from '@/types';
import { assignProfile } from '@/data/profiles';

export function calculateSignalScores(answers: UserAnswer[]): Record<Signal, number> {
  const scores: Record<Signal, number> = {
    Trust: 0,
    Adoption: 0,
    Efficiency: 0,
    ContextAwareness: 0,
    HumanBehavior: 0,
    SystemsThinking: 0,
  };

  answers.forEach((answer) => {
    answer.signals.forEach((signal) => {
      scores[signal] = (scores[signal] || 0) + 1;
    });
  });

  return scores;
}

export function assignUserProfile(answers: UserAnswer[]): {
  profile: AIThinkingProfile;
  signalScores: Record<Signal, number>;
} {
  const signalScores = calculateSignalScores(answers);
  const profile = assignProfile(signalScores);

  return {
    profile,
    signalScores,
  };
}
