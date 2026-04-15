import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `You are NestFinder's property assistant for a United States real estate marketplace. 
Answer concisely about buying, selling, financing, inspections, neighborhoods, and using the site (explore listings, saved viewings, reviews). 
Do not invent specific listing prices or addresses. If asked for legal or tax advice, suggest consulting a licensed professional.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length > 30) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      const client = new OpenAI({ apiKey });
      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map(
            (m: { role: string; content: string }) => ({
              role: m.role as "user" | "assistant",
              content: String(m.content).slice(0, 8000),
            }),
          ),
        ],
        max_tokens: 600,
      });
      const text = completion.choices[0]?.message?.content?.trim();
      if (text) {
        return NextResponse.json({ reply: text, source: "openai" });
      }
    }
    const last =
      messages.filter((m: { role: string }) => m.role === "user").pop()
        ?.content ?? "";
    const fallback = buildFallback(String(last));
    return NextResponse.json({ reply: fallback, source: "local" });
  } catch {
    return NextResponse.json(
      {
        reply:
          "I am having trouble reaching the AI service. Try again in a moment, or browse listings on the Explore page for current homes.",
        source: "error",
      },
      { status: 200 },
    );
  }
}

function buildFallback(userText: string): string {
  const t = userText.toLowerCase();
  if (t.includes("mortgage") || t.includes("finance") || t.includes("loan")) {
    return "Most buyers compare conventional, FHA, and VA loans with at least three lenders. Check your credit report, gather pay stubs and tax returns, and ask each lender for a Loan Estimate so you can compare APR and closing costs on equal terms.";
  }
  if (t.includes("offer") || t.includes("bid")) {
    return "Review comparable sales with your agent, decide on earnest money and contingencies (inspection, appraisal, financing), and set a clear expiration time. In competitive markets, a pre-approval letter and flexible closing date can strengthen your offer.";
  }
  if (t.includes("inspection")) {
    return "A professional inspection covers structure, roof, electrical, plumbing, and HVAC. Attend if you can, read the full report—not just the summary—and negotiate repairs or credits before removing the inspection contingency.";
  }
  if (t.includes("neighborhood") || t.includes("school")) {
    return "Visit at different times of day, check commute routes, noise, and local services. Verify school boundaries with the district office, and review public records for planned development nearby.";
  }
  return "I can help with buying steps, financing basics, inspections, and how to use NestFinder (search filters, saving viewings, reading reviews). Ask a specific question, or tell me whether you are buying, selling, or renting.";
}
