import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  // Challenge Task: Rate limit AI endpoint to 5 requests per user per minute
  const { allowed, remaining } = await checkRateLimit(`ai_assistant:${ip}`, 5, 60000);

  if (!allowed) {
    return NextResponse.json(
      { error: 'AI Rate Limit Exceeded: Maximum 5 requests per minute allowed.' },
      { status: 429 }
    );
  }

  try {
    const { command, selectedText } = await request.json();
    if (!selectedText) {
      return NextResponse.json({ error: 'No text selected' }, { status: 400 });
    }

    let aiOutput = '';
    switch (command) {
      case 'Improve writing':
        aiOutput = `${selectedText.trim()} — meticulously refactored for clarity, tone, and production excellence.`;
        break;
      case 'Summarise':
        aiOutput = `Executive Summary: ${selectedText.slice(0, 80)}... (Concise breakdown).`;
        break;
      case 'Translate':
        aiOutput = `[Français] ${selectedText.trim()} (Traduction certifiée AI).`;
        break;
      case 'Continue':
        aiOutput = `${selectedText} Moreover, continuous automated deployment verification guarantees zero regressions in live production environments.`;
        break;
      default:
        aiOutput = selectedText;
    }

    // Simulate network delay
    await new Promise((res) => setTimeout(res, 600));

    return NextResponse.json({ result: aiOutput, remaining });
  } catch {
    return NextResponse.json({ error: 'AI execution failed' }, { status: 500 });
  }
}
