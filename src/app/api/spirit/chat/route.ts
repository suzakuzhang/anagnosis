import { NextRequest, NextResponse } from "next/server";
import {
  getSpiritSession,
  getViewContext,
  canChat,
  addMessage,
  consumeRound,
  getRecentMessages,
} from "@/lib/spirit/session";
import { generateSpiritReply } from "@/lib/llm/spiritLlm";
import { buildSpiritSystemPrompt, buildSpiritReplyPrompt } from "@/lib/spirit/prompts";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const sessionId = (body.sessionId ?? "").trim();
  const userMessage = (body.message ?? "").trim();

  if (!sessionId || !userMessage) {
    return NextResponse.json({ error: "缺少 sessionId 或 message" }, { status: 400 });
  }

  if (userMessage.length > 300) {
    return NextResponse.json({ error: "消息过长，请控制在 300 字以内" }, { status: 400 });
  }

  const session = getSpiritSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "会话不存在或已过期" }, { status: 404 });
  }

  if (!canChat(session)) {
    return NextResponse.json({
      error: session.status === "expired" ? "会话已超时" : "对话轮次已用完",
      status: session.status,
      remainingRounds: session.remainingRounds,
    }, { status: 403 });
  }

  const ctx = getViewContext(session.viewId);
  if (!ctx) {
    return NextResponse.json({ error: "导览上下文丢失" }, { status: 500 });
  }

  addMessage(sessionId, "user", userMessage);

  const recent = getRecentMessages(sessionId, 8);
  const systemPrompt = buildSpiritSystemPrompt();
  const replyPrompt = buildSpiritReplyPrompt(
    ctx.paintingTitle,
    ctx.artistName,
    ctx.visibleElements,
    ctx.formAndTechnique,
    ctx.inscriptionsAndText || "",
    ctx.sourceText || "",
    ctx.iconographicIds || [],
    ctx.culturalFramingBox || "",
    ctx.question,
    recent.map((m) => ({ role: m.role, content: m.content })),
    userMessage
  );

  let reply: string;
  try {
    reply = await generateSpiritReply(systemPrompt, replyPrompt);
  } catch {
    reply = `Let us return to the picture — ${ctx.visibleElements.slice(0, 60)}… Stay with that passage a little longer; that brings us closer to this painting than rushing the question.`;
  }

  addMessage(sessionId, "assistant", reply);
  consumeRound(sessionId);

  const updated = getSpiritSession(sessionId)!;

  return NextResponse.json({
    reply,
    remainingRounds: updated.remainingRounds,
    status: updated.status,
    expiresAt: updated.expiresAt,
  });
}
