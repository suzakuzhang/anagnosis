import { NextRequest, NextResponse } from "next/server";
import {
  listPaintingBriefs,
  searchPaintings,
  getCorpusMeta,
  getAnchor,
  listArtists,
} from "@/lib/data/paintings";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const lens = req.nextUrl.searchParams.get("lens")?.trim() ?? "";
  const subject = req.nextUrl.searchParams.get("subject")?.trim() ?? "";

  let items = listPaintingBriefs();

  if (q) {
    const matched = searchPaintings(q).map((p) => p.id);
    items = items.filter((p) => matched.includes(p.id));
  }
  if (lens) {
    items = items.filter((p) => p.reading_lenses.includes(lens));
  }
  if (subject) {
    items = items.filter((p) => p.subject_class.includes(subject));
  }

  return NextResponse.json({
    corpus_meta: getCorpusMeta(),
    anchor: getAnchor(),
    artists: listArtists(),
    items,
    total: items.length,
  });
}
