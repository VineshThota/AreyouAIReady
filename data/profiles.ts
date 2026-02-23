import { ProfileDescriptor, AIThinkingProfile, Signal } from '@/types';

export const PROFILES: Record<AIThinkingProfile, ProfileDescriptor> = {
  'Systems Thinker': {
    name: 'Systems Thinker',
    description: 'Understands how AI interacts with workflows, incentives, and context.',
    signals: ['SystemsThinking', 'ContextAwareness'],
  },
  'Adoption Realist': {
    name: 'Adoption Realist',
    description: 'Focuses on whether people will actually use AI in practice.',
    signals: ['Adoption', 'HumanBehavior'],
  },
  'Trust-Focused Operator': {
    name: 'Trust-Focused Operator',
    description: 'Prioritizes reliability, accountability, and confidence in outputs.',
    signals: ['Trust', 'Efficiency'],
  },
  'Human-Centered Technologist': {
    name: 'Human-Centered Technologist',
    description: 'Evaluates AI through behavior, communication, and user comfort.',
    signals: ['HumanBehavior', 'ContextAwareness'],
  },
  'Workflow Optimizer': {
    name: 'Workflow Optimizer',
    description: 'Looks for efficiency gains and tangible value from AI integration.',
    signals: ['Efficiency', 'SystemsThinking'],
  },
  'Strategic Observer': {
    name: 'Strategic Observer',
    description: 'Considers long-term organizational and decision impact of AI.',
    signals: ['SystemsThinking', 'Trust'],
  },
};

// Profile assignment logic based on signal weights
export function assignProfile(signalScores: Record<Signal, number>): AIThinkingProfile {
  // Calculate cluster scores
  const clusterScores: Record<string, number> = {
    'Systems Thinker': (signalScores['SystemsThinking'] || 0) + (signalScores['ContextAwareness'] || 0),
    'Adoption Realist': (signalScores['Adoption'] || 0) + (signalScores['HumanBehavior'] || 0),
    'Trust-Focused Operator': (signalScores['Trust'] || 0) + (signalScores['Efficiency'] || 0),
    'Human-Centered Technologist': (signalScores['HumanBehavior'] || 0) + (signalScores['ContextAwareness'] || 0),
    'Workflow Optimizer': (signalScores['Efficiency'] || 0) + (signalScores['SystemsThinking'] || 0),
    'Strategic Observer': (signalScores['SystemsThinking'] || 0) + (signalScores['Trust'] || 0),
  };

  // Find the profile with the highest score
  const sortedProfiles = Object.entries(clusterScores)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .map(([profile]) => profile as AIThinkingProfile);

  // Return the top profile, ensuring no negative outcomes (all profiles are positive)
  return sortedProfiles[0] || 'Systems Thinker';
}

// Get profile description
export function getProfileDescription(profile: AIThinkingProfile): string {
  return PROFILES[profile].description;
}
