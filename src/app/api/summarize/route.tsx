import { NextRequest, NextResponse } from 'next/server';
import Groq from "groq-sdk";

const qroq = new Groq({
  apiKey: process.env.QROQ_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { transcript, prompt } = await req.json();

    if (!transcript || !prompt) {
      return new NextResponse('Missing transcript or prompt', { status: 400 });
    }

    const sys = `You are a meeting-notes assistant.
Return a clean, concise, well-structured summary.
If the prompt asks for bullets, use "-" bullets.
Always include (if available): Decisions, Action Items (with owners & due dates), Risks/Blockers, Next Steps.`;

    const user = `CUSTOM INSTRUCTION:\n${prompt}\n\nTRANSCRIPT:\n${transcript}`;

    const response = await qroq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: user }
      ],
      temperature: 0.2,
    });

    const summary = response.choices?.[0]?.message?.content?.trim() || '';
    return NextResponse.json({ summary });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'LLM error';
    return new NextResponse(message, { status: 500 });
  }
}
