import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  const { prompt } = (await req.json()) as { prompt?: string };

  if (!prompt || prompt.length < 5) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 503 });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: `Realistic photograph for TOEIC listening practice. Clear, well-lit, professional looking. Subject: ${prompt}. No text, no captions, no watermarks.`,
        size: "1024x1024",
        n: 1,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `OpenAI API error: ${errText}` }, { status: res.status });
    }

    const data = (await res.json()) as {
      data?: Array<{ url?: string; b64_json?: string }>;
    };
    const first = data.data?.[0];
    if (first?.b64_json) {
      return NextResponse.json({ dataUrl: `data:image/png;base64,${first.b64_json}` });
    }
    if (first?.url) {
      return NextResponse.json({ url: first.url });
    }
    return NextResponse.json({ error: "no image returned" }, { status: 500 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
