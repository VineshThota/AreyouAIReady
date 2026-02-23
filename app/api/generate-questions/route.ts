import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Question } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const DOMAINS = [
  { id: 1, name: 'Email & meetings', easyFocus: 'Summaries, followups, scheduling', hardFocus: 'Decision traceability, interpretation risk' },
  { id: 2, name: 'Productivity', easyFocus: 'Reminders, drafting, automation', hardFocus: 'Dependency, cognitive load, behavior shifts' },
  { id: 3, name: 'Collaboration', easyFocus: 'Suggested replies, tagging, sharing', hardFocus: 'Ownership, politics, trust in shared outputs' },
  { id: 4, name: 'Learning', easyFocus: 'Summaries, search, assistants', hardFocus: 'Expertise erosion, bias, shallow learning' },
  { id: 5, name: 'Customer interaction', easyFocus: 'Draft responses, personalization', hardFocus: 'Brand risk, escalation, emotional nuance' },
  { id: 6, name: 'Decision support', easyFocus: 'Dashboards, recommendations', hardFocus: 'Metric distortion, over-trust, incentives' },
  { id: 7, name: 'Company workflows', easyFocus: 'Approvals, policy checks', hardFocus: 'Power shifts, compliance interpretation' },
  { id: 8, name: 'Future of work', easyFocus: 'Role automation ideas', hardFocus: 'Role redesign, leverage, org structure' },
];

export async function POST(request: NextRequest) {
  try {
    const { difficulty } = await request.json();

    if (!difficulty || !['easy', 'hard'].includes(difficulty)) {
      return NextResponse.json({ error: 'Invalid difficulty level' }, { status: 400 });
    }

    const generateQuestion = async (domain: typeof DOMAINS[number]): Promise<Question> => {
      const focus = difficulty === 'easy' ? domain.easyFocus : domain.hardFocus;

      const prompt = `Generate a thought-provoking workplace AI scenario for the domain: "${domain.name}". Focus: ${focus}.

LENGTH RULES — strict:
- scenario: 2 sentences, 30–50 words total. Set context then present a real tension or decision.
- each option: 15–22 words. A first-person perspective that reveals how someone thinks about AI. All 4 options should be roughly the same length.

Quality rules:
- Write in second person ("you" / "your team") — the reader is a general employee in a modern workplace.
- NEVER assume or name the reader's job title or role. Do NOT start with "As a [role]", "You are a [role]", or any occupation framing.
- The scenario must feel real and specific — include a concrete detail (a tool, a metric, a workplace situation). No generic filler.
- The 4 options must represent genuinely different professional mindsets — not just agree/disagree variations.
- Each option gets 1–2 signal tags from: Trust, Adoption, Efficiency, ContextAwareness, HumanBehavior, SystemsThinking
- No buzzwords. No jargon. Write like a thoughtful professional, not a consultant.

Return ONLY valid JSON, no markdown:
{
  "scenario": "...",
  "options": [
    { "id": "a", "text": "...", "signals": ["Signal1"] },
    { "id": "b", "text": "...", "signals": ["Signal1"] },
    { "id": "c", "text": "...", "signals": ["Signal1"] },
    { "id": "d", "text": "...", "signals": ["Signal1"] }
  ]
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 700,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error(`No response for domain: ${domain.name}`);

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error(`Could not parse JSON for domain: ${domain.name}`);

      const questionData = JSON.parse(jsonMatch[0]);
      return {
        id: domain.id,
        domain: domain.name,
        difficulty,
        scenario: questionData.scenario,
        options: questionData.options,
      };
    };

    const questions = await Promise.all(DOMAINS.map(generateQuestion));
    return NextResponse.json({ questions });

  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 });
  }
}
