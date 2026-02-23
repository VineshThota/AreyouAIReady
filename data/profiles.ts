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

// Per-profile LinkedIn post text
export const LINKEDIN_TEXT: Record<AIThinkingProfile, { opener: string; reminder: string }> = {
  'Systems Thinker': {
    opener: "I just completed an AI Sense Check — a quick reflection on how I think about AI within systems, workflows, and real-world context.",
    reminder: "It's a good reminder that AI only works when it fits the system — context, incentives, and integration matter as much as the technology itself.",
  },
  'Adoption Realist': {
    opener: "I just completed an AI Sense Check — a quick reflection on how I evaluate whether AI tools actually get used in practice.",
    reminder: "It's a good reminder that the best AI tool means nothing if people don't adopt it — real-world usage is the true measure of success.",
  },
  'Trust-Focused Operator': {
    opener: "I just completed an AI Sense Check — a quick reflection on how I assess reliability and accountability in AI-driven decisions.",
    reminder: "It's a good reminder that trust in AI isn't given — it's earned through consistent, reliable, and accountable outputs.",
  },
  'Human-Centered Technologist': {
    opener: "I just completed an AI Sense Check — a quick reflection on how I think about the human experience of working alongside AI.",
    reminder: "It's a good reminder that AI success isn't just about features — it's about how people experience, communicate with, and feel comfortable using the technology.",
  },
  'Workflow Optimizer': {
    opener: "I just completed an AI Sense Check — a quick reflection on how I approach AI as a driver of real efficiency gains and tangible impact.",
    reminder: "It's a good reminder that AI value isn't theoretical — it shows up in time saved, tasks streamlined, and outcomes you can actually measure.",
  },
  'Strategic Observer': {
    opener: "I just completed an AI Sense Check — a quick reflection on how I evaluate AI's long-term impact on strategy and organizational decisions.",
    reminder: "It's a good reminder that AI decisions made today shape how organizations operate tomorrow — long-term thinking matters more than short-term hype.",
  },
};
