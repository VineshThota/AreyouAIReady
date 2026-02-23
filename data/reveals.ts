// Reveal text structure
export interface Reveal {
  encouragement: string;
  rationale: string;
  context: string;
}

// Generic reveals that work across most perspectives
export const genericReveals: Record<string, Reveal> = {
  trustFocus: {
    encouragement: "Great instinct! AI frameworks need people who focus on reliability and trust.",
    rationale: "When tools get details wrong, confidence drops quickly in the real world.",
    context: "In reality, adoption usually depends on trust, control, authenticity, and visible value working together."
  },

  adoptionFocus: {
    encouragement: "Smart thinking! Adoption depends on real human behavior, not just features.",
    rationale: "People decide whether to use AI based on friction, habit, and perceived value.",
    context: "In reality, tools succeed when they fit naturally into workflows and social dynamics."
  },

  efficiencyFocus: {
    encouragement: "Solid perspective. Efficiency matters when it's measurable and real.",
    rationale: "The best AI wins aren't always about speed—they're about the right kind of value.",
    context: "In reality, organizations care about efficiency, but it's one factor among many."
  },

  contextFocus: {
    encouragement: "Thoughtful approach. Context shapes how AI is actually used.",
    rationale: "The same tool works differently depending on incentives, culture, and constraints.",
    context: "In reality, success requires understanding the specific conditions where people work."
  },

  systemsFocus: {
    encouragement: "Sharp thinking. Systems-level effects matter more than individual features.",
    rationale: "Small changes in how AI is deployed can cascade through workflows and behaviors.",
    context: "In reality, the biggest AI wins come from rethinking the whole system, not just automating tasks."
  },

  humanFocus: {
    encouragement: "Insightful choice. Human factors drive real outcomes.",
    rationale: "Comfort, clarity, and control matter as much as capability.",
    context: "In reality, people make or break AI adoption through how they interpret and act on outputs."
  },
};

// Domain-specific reveal variations (can be customized per domain)
export function getRevealForDomain(_domain: string, selectedSignals: string[]): Reveal {
  // Use generic reveals as base; can be customized per domain later
  const signalType = selectedSignals[0];

  switch(signalType) {
    case 'Trust':
      return genericReveals.trustFocus;
    case 'Adoption':
      return genericReveals.adoptionFocus;
    case 'Efficiency':
      return genericReveals.efficiencyFocus;
    case 'ContextAwareness':
      return genericReveals.contextFocus;
    case 'SystemsThinking':
      return genericReveals.systemsFocus;
    case 'HumanBehavior':
      return genericReveals.humanFocus;
    default:
      return genericReveals.trustFocus;
  }
}
