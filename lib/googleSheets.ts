import { QuizSession } from '@/types';

export async function saveSessionToGoogleSheets(session: QuizSession): Promise<boolean> {
  try {
    const response = await fetch('/api/save-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(session),
    });

    if (!response.ok) {
      console.error('Failed to save session:', response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving session:', error);
    return false;
  }
}
