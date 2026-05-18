import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  const { messages, topic } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ reply: null, mock: true });
  }

  try {
    const systemPrompt = `You are a friendly English conversation partner helping a Japanese learner practice English.
Topic: ${topic ?? "general conversation"}.
Guidelines:
- Use natural, conversational English at intermediate level (TOEIC 600-800).
- Keep responses 1-3 sentences.
- Ask follow-up questions to encourage conversation.
- If the user makes a clear grammar mistake, gently correct it in a natural way.`;

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({ role: m.role, content: m.content })),
    ];

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: apiMessages,
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content ?? null;
    return NextResponse.json({ reply });
  } catch (e) {
    return NextResponse.json({ reply: null, error: "API error" }, { status: 500 });
  }
}
