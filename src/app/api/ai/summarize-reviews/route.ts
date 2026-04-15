import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { reviews } = await req.json();
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json(
        { error: "No reviews to summarize." },
        { status: 400 },
      );
    }
    const text = reviews
      .map(
        (r: { rating?: number; comment?: string }, i: number) =>
          `Review ${i + 1} (${r.rating ?? "?"} stars): ${r.comment ?? ""}`,
      )
      .join("\n")
      .slice(0, 12000);

    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      const client = new OpenAI({ apiKey });
      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Summarize the following property reviews in 3-5 short bullet points. Note consensus praise and recurring concerns. Stay neutral and factual.",
          },
          { role: "user", content: text },
        ],
        max_tokens: 400,
      });
      const summary = completion.choices[0]?.message?.content?.trim();
      if (summary) {
        return NextResponse.json({ summary, source: "openai" });
      }
    }
    const local = localSummarize(
      reviews as { rating: number; comment: string }[],
    );
    return NextResponse.json({ summary: local, source: "local" });
  } catch {
    return NextResponse.json(
      {
        summary:
          "Reviews highlight overall satisfaction; open individual comments below for full detail.",
        source: "error",
      },
      { status: 200 },
    );
  }
}

function localSummarize(
  reviews: { rating: number; comment: string }[],
): string {
  const avg =
    reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length;
  const high = reviews.filter((r) => r.rating >= 4).length;
  const low = reviews.filter((r) => r.rating <= 2).length;
  return [
    `• Average rating across ${reviews.length} reviews is ${avg.toFixed(1)} out of 5.`,
    high > 0
      ? `• ${high} review${high > 1 ? "s" : ""} are strongly positive (4–5 stars).`
      : "• Few strongly positive scores; read comments for nuance.",
    low > 0
      ? `• ${low} review${low > 1 ? "s" : ""} raise concerns (1–2 stars)—check those for recurring issues.`
      : "• No very low scores; sentiment is generally steady.",
    "• Read full comments for specifics on condition, location, and communication.",
  ].join("\n");
}
