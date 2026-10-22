import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    courseTitle?: string;
    blockTitle?: string;
    question?: string;
  };

  const courseTitle = body.courseTitle || "Interactive Course";
  const blockTitle = body.blockTitle || "Current Concept Block";
  const question = body.question?.trim() || "Can you explain the intuition behind this block?";

  const reply = `In **${courseTitle}** (${blockTitle}), here is the key intuition for *"${question}"*:\n\n1. **Core Mechanism**: Focus on how changing the independent parameter directly shifts the system's equilibrium or graph curve.\n2. **Visual Check**: Use the interactive slider in the simulation canvas above to test extreme boundary values (minimum vs. maximum).\n3. **Quick Self-Test**: Ask yourself what remains invariant when the input doubles—that invariant is the governing law of this block!`;

  return NextResponse.json({
    reply,
    timestamp: new Date().toISOString(),
  });
}
