// Signal types for profile assignment
export type Signal = 'Trust' | 'Adoption' | 'Efficiency' | 'ContextAwareness' | 'HumanBehavior' | 'SystemsThinking';

// AI Thinking Profiles
export type AIThinkingProfile =
  | 'Systems Thinker'
  | 'Adoption Realist'
  | 'Trust-Focused Operator'
  | 'Human-Centered Technologist'
  | 'Workflow Optimizer'
  | 'Strategic Observer';

// Question option structure
export interface QuestionOption {
  id: string;
  text: string;
  signals: Signal[];
}

// Single question structure
export interface Question {
  id: number;
  domain: string;
  difficulty: 'easy' | 'hard';
  scenario: string;
  options: QuestionOption[];
}

// User answer tracking
export interface UserAnswer {
  questionId: number;
  selectedOptionId: string;
  signals: Signal[];
}

// Session data structure
export interface QuizSession {
  sessionId: string;
  name?: string;
  email?: string;
  difficulty: 'easy' | 'hard';
  questions: Question[];
  answers: UserAnswer[];
  aiProfile?: AIThinkingProfile;
  certificateId?: string;
  geography?: {
    city?: string;
    country?: string;
  };
  createdAt: string;
}

// Profile descriptor
export interface ProfileDescriptor {
  name: AIThinkingProfile;
  description: string;
  signals: Signal[];
}

// API Response types
export interface GenerateQuestionsResponse {
  questions: Question[];
}

export interface ProfileAssignmentResult {
  profile: AIThinkingProfile;
  signalScores: Record<Signal, number>;
}
