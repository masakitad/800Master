import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  const { text } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ translation: null });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a translator. Translate the given English text into natural Japanese. Output only the translation.",
          },
          { role: "user", content: text },
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    const data = await res.json();
    const translation = data.choices?.[0]?.message?.content ?? null;
    return NextResponse.json({ translation });
  } catch {
    return NextResponse.json({ translation: null }, { status: 500 });
  }
}
