import { NextRequest, NextResponse } from "next/server";
import {
  registerView,
  getViewContext,
  createSpiritSession,
  addMessage,
} from "@/lib/spirit/session";
import { generateSpiritReply } from "@/lib/llm/spiritLlm";
import { buildSpiritSystemPrompt, buildSpiritOpeningPrompt } from "@/lib/spirit/prompts";
import { getPainting } from "@/lib/data/paintings";
import { addUsageLog, getSession } from "@/lib/access/session";
import { ROLE_NORMAL } from "@/lib/access/roles";
import type { Role } from "@/lib/access/roles";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const viewId = (body.viewId ?? "").trim();
  const paintingId = (body.paintingId ?? "").trim();
  const question = (body.question ?? "").trim();
  const initialInterpretation = (body.initialInterpretation ?? "").trim() || undefined;

  if (!viewId || !paintingId) {
    return NextResponse.json({ error: "Missing viewId or paintingId" }, { status: 400 });
  }

  const painting = getPainting(paintingId);
  if (!painting) {
    return NextResponse.json({ error: "Painting not found" }, { status: 404 });
  }
  const artist = painting.artist;

  // Register view context (always, in case user re-enters spirit mode after refresh)
  registerView({
    viewId,
    paintingId,
    paintingTitle: painting.title,
    artistName: artist.name,
    artistDates: artist.dates,
    medium: painting.medium,
    dimensions: painting.dimensions,
    format: painting.format,
    collection: painting.collection,
    approximateDate: painting.approximate_date,
    visibleElements: painting.visible_elements,
    compositionNotes: painting.composition_notes,
    formAndTechnique: painting.form_and_technique,
    inscriptionsAndText: painting.inscriptions_and_text,
    sourceText: painting.source_text,
    iconographicIds: painting.iconographic_ids,
    culturalFramingBox: painting.cultural_framing_box,
    question,
    initialInterpretation,
  });

  const ctx = getViewContext(viewId);
  if (!ctx) {
    return NextResponse.json({ error: "Could not initialize the guide context" }, { status: 500 });
  }

  const session = createSpiritSession(viewId);
  if (!session) {
    return NextResponse.json({ error: "Failed to create the guide session" }, { status: 500 });
  }

  const systemPrompt = buildSpiritSystemPrompt();
  const openingPrompt = buildSpiritOpeningPrompt(
    ctx.paintingTitle,
    ctx.artistName,
    ctx.visibleElements,
    ctx.formAndTechnique,
    ctx.inscriptionsAndText || "",
    ctx.sourceText || "",
    ctx.iconographicIds || [],
    ctx.culturalFramingBox || "",
    ctx.question,
    ctx.initialInterpretation
  );

  let openingMessage: string;
  try {
    openingMessage = await generateSpiritReply(systemPrompt, openingPrompt);
  } catch {
    openingMessage = `Let us not rush into the story of ${ctx.paintingTitle}. Pick any single passage in the picture — ${ctx.visibleElements.slice(0, 80)}… Would you stay there with me for a moment?`;
  }

  addMessage(session.sessionId, "assistant", openingMessage);

  // Log usage
  const token = (body.access_token as string ?? req.headers.get("x-access-token") ?? "").trim();
  let role: Role = ROLE_NORMAL;
  let userId = "anonymous";
  if (token) {
    const s = getSession(token);
    if (s) {
      role = s.role as Role;
      userId = s.userId;
    }
  }
  addUsageLog({
    action: "spirit_start",
    role,
    userId,
    subjectName: ctx.paintingTitle,
    question,
    ip: req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "",
    extra: { paintingId, viewId },
  });

  return NextResponse.json({
    session: {
      sessionId: session.sessionId,
      paintingTitle: session.paintingTitle,
      remainingRounds: session.remainingRounds,
      status: session.status,
      expiresAt: session.expiresAt,
    },
    openingMessage,
  });
}
