import { NextResponse } from "next/server";
import { getPainting, getCorpusMeta, getAnchor } from "@/lib/data/paintings";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const painting = getPainting(params.id);
  if (!painting) {
    return NextResponse.json({ error: "Painting not found" }, { status: 404 });
  }
  return NextResponse.json({
    painting,
    artist: painting.artist,
    corpus_meta: getCorpusMeta(),
    anchor: getAnchor(),
  });
}
