import { NextRequest, NextResponse } from "next/server";
import { getSpiritSession, endSession } from "@/lib/spirit/session";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const sessionId = (body.sessionId ?? "").trim();

  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  const session = getSpiritSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  endSession(sessionId);

  return NextResponse.json({
    status: "ended",
    farewell: `The guided look at “${session.paintingTitle}” pauses here. Next time you look, the picture may hold details you didn't notice this time.`,
  });
}
