import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  topic: z.string().min(2),
  message: z.string().min(20),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please complete all fields with enough detail." }, { status: 400 });
    }
    return NextResponse.json({
      success: true,
      message:
        "Thanks—our concierge team routes messages by topic. Expect a reply within one business day during Pacific hours.",
    });
  } catch {
    return NextResponse.json({ error: "Could not send message." }, { status: 500 });
  }
}
