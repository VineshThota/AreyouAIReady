import { NextRequest, NextResponse } from 'next/server';
import { QuizSession, Question, UserAnswer } from '@/types';
import { getRevealForDomain } from '@/data/reveals';

function buildQuestionsAndOptions(questions: Question[]): string {
  return questions
    .map((q, i) => {
      const options = q.options.map(o => `  ${o.id.toUpperCase()}) ${o.text}`).join('\n');
      return `Q${i + 1} [${q.domain}]: ${q.scenario}\n${options}`;
    })
    .join('\n\n');
}

function buildAnswersWithReveals(questions: Question[], answers: UserAnswer[]): string {
  return answers
    .map((answer, i) => {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) return `Q${i + 1}: No data`;

      const option = question.options.find(o => o.id === answer.selectedOptionId);
      const reveal = option ? getRevealForDomain(question.domain, option.signals) : null;
      const optionText = option?.text ?? answer.selectedOptionId;
      const revealText = reveal
        ? `${reveal.encouragement} — ${reveal.rationale} — ${reveal.context}`
        : '';

      return `Q${i + 1} [${question.domain}]:\n  Answer: "${optionText}"\n  Reveal: ${revealText}`;
    })
    .join('\n\n');
}

export async function POST(request: NextRequest) {
  try {
    const session: QuizSession = await request.json();

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn('GOOGLE_SHEETS_WEBHOOK_URL not set — session not saved to Sheets.');
      return NextResponse.json({ success: true, sessionId: session.sessionId });
    }

    const payload = {
      sessionId: session.sessionId,
      name: session.name || '',
      email: session.email || '',
      difficulty: session.difficulty,
      aiProfile: session.aiProfile || '',
      certificateId: session.certificateId || '',
      geography: [session.geography?.city, session.geography?.country]
        .filter(Boolean)
        .join(', '),
      startedAt: session.createdAt || '',
      completedAt: session.completedAt || '',
      linkedInClicked: session.linkedInClicked ? 'Yes' : 'No',
      questionsAndOptions: buildQuestionsAndOptions(session.questions),
      answersAndReveals: buildAnswersWithReveals(session.questions, session.answers),
    };

    const sheetsResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!sheetsResponse.ok) {
      console.error('Google Sheets webhook error:', sheetsResponse.status, await sheetsResponse.text());
    }

    return NextResponse.json({ success: true, sessionId: session.sessionId });
  } catch (error) {
    console.error('Error saving session:', error);
    return NextResponse.json(
      { error: 'Failed to save session' },
      { status: 500 }
    );
  }
}
