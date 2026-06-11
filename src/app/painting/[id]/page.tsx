"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ModeSelector from "@/components/ModeSelector";
import InterpretationPanel from "@/components/InterpretationPanel";
import LoadingOverlay from "@/components/LoadingOverlay";
import SpiritPanel from "@/components/SpiritPanel";
import type { Painting, ReadingMode, ArtistInfo, CorpusMeta, CorpusAnchor } from "@/types/painting";

interface PaintingResponse {
  painting: Painting;
  artist: ArtistInfo;
  corpus_meta: CorpusMeta;
  anchor: CorpusAnchor;
}

interface InterpretResponse {
  mode: ReadingMode;
  paintingId: string;
  result: unknown;
}

function genViewId(): string {
  return `view_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function PaintingPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<PaintingResponse | null>(null);
  const [mode, setMode] = useState<ReadingMode>("beginner");
  const [question, setQuestion] = useState("");
  const [roamEntry, setRoamEntry] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InterpretResponse | null>(null);
  const [error, setError] = useState("");
  const [viewId, setViewId] = useState("");
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    fetch(`/api/paintings/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setError(d.error);
        } else {
          setData(d);
        }
      })
      .catch(() => setError("Failed to load"));
  }, [params.id]);

  const submit = async () => {
    if (!data) return;
    setLoading(true);
    setError("");
    setResult(null);

    const newViewId = genViewId();
    setViewId(newViewId);

    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paintingId: data.painting.id,
          mode,
          question: question.trim() || undefined,
          roamEntry: mode === "roam" ? (roamEntry.trim() || undefined) : undefined,
          viewId: newViewId,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Reading failed");
      } else {
        setResult(json);
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  const onFollowUp = (q: string) => {
    setQuestion(q);
  };

  if (error && !data) {
    return <p className="text-sm text-red-600">{error}</p>;
  }
  if (!data) {
    return <p className="text-sm text-[var(--muted)]">Loading…</p>;
  }

  const p = data.painting;
  const a = data.artist;
  // For spirit panel context, summarize current interpretation if any (best-effort)
  const interpretationSummary = result
    ? (() => {
        const r = result.result as Record<string, unknown>;
        const fragments: string[] = [];
        for (const k of ["first_glance", "viewing_path", "emotional_field", "entry_point", "walk_through"]) {
          const v = r[k];
          if (typeof v === "string") fragments.push(v.slice(0, 200));
        }
        return fragments.join(" / ").slice(0, 800) || undefined;
      })()
    : undefined;

  return (
    <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.92fr)] lg:px-5">
      <section className="surface-gallery flex max-h-[calc(100vh-5.5rem)] min-h-[30rem] flex-col overflow-hidden rounded-[8px] lg:sticky lg:top-[4.25rem] lg:min-h-[34rem]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
          <div>
            <p className="text-[11px] tracking-[0.28em] text-[var(--muted)]">VIEWING ROOM</p>
            <h1 className="mt-1 text-xl font-medium leading-tight tracking-[0.08em] text-[var(--vellum)]">{p.title}</h1>
            {p.alt_titles && p.alt_titles.length > 0 && (
              <p className="mt-1 text-xs text-[var(--muted)]">Also titled: {p.alt_titles.join(", ")}</p>
            )}
          </div>
          <a href="/gallery" className="text-xs tracking-[0.18em] text-[var(--muted)] underline underline-offset-4 hover:text-[var(--vellum)]">
            Back to gallery
          </a>
        </div>

        <div className="relative min-h-0 flex-1 overflow-auto bg-black/45 p-4">
          <div className="flex min-h-full items-center justify-center">
            <img
              src={p.image_path}
              alt={p.title}
              className="max-h-full max-w-full object-contain transition-transform duration-500"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
            />
          </div>
        </div>

        <div className="border-t border-[var(--border)] px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs tracking-[0.16em] text-[var(--muted)]">DETAIL</label>
            <input
              type="range"
              min="1"
              max="2.2"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="min-w-[9rem] flex-1 accent-[var(--gold)]"
            />
            <button
              onClick={() => setZoom(1)}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)] transition-colors hover:border-[var(--gold)] hover:text-[var(--vellum)]"
            >
              Reset
            </button>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs leading-6 text-[var(--muted)] md:grid-cols-3">
            <div><dt className="inline text-[var(--vellum-dim)]">Artist: </dt><dd className="inline">{a.name} ({a.dates}){a.origin ? `, ${a.origin}` : ""}</dd></div>
            <div><dt className="inline text-[var(--vellum-dim)]">Medium: </dt><dd className="inline">{p.medium}</dd></div>
            <div><dt className="inline text-[var(--vellum-dim)]">Dimensions: </dt><dd className="inline">{p.dimensions}</dd></div>
            <div><dt className="inline text-[var(--vellum-dim)]">Format: </dt><dd className="inline">{p.format}</dd></div>
            <div className="md:col-span-2"><dt className="inline text-[var(--vellum-dim)]">Collection: </dt><dd className="inline">{p.collection}</dd></div>
            {p.approximate_date && (
              <div><dt className="inline text-[var(--vellum-dim)]">Date: </dt><dd className="inline">{p.approximate_date}</dd></div>
            )}
          </dl>
        </div>
      </section>

      <aside className="space-y-4 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto lg:pr-1">
        <section className="surface-gallery gallery-rise rounded-[8px] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.28em] text-[var(--muted)]">GUIDE</p>
              <h2 className="mt-1 text-base font-medium tracking-[0.12em] text-[var(--vellum)]">Choose a reading mode</h2>
            </div>
          {p.subject_class.length > 0 && (
              <div className="flex max-w-[45%] flex-wrap justify-end gap-1.5">
              {p.subject_class.map((s) => (
                  <span key={s} className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[11px] text-[var(--muted)]">{s}</span>
              ))}
            </div>
          )}
          </div>
          <ModeSelector value={mode} onChange={setMode} />
        </section>

        <section className="surface-gallery space-y-3 rounded-[8px] p-4">
        {mode === "roam" ? (
          <>
              <label className="block text-sm font-medium text-[var(--vellum)]">Where do you enter the painting?</label>
            <input
              type="text"
              value={roamEntry}
              onChange={(e) => setRoamEntry(e.target.value)}
                placeholder="e.g. from the milk stream / from the doorway in the background / where the figures' gazes meet"
                className="field-gallery w-full rounded px-3 py-2 text-sm"
            />
          </>
        ) : (
          <>
              <label className="block text-sm font-medium text-[var(--vellum)]">What question do you want to bring to this painting? (optional)</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
                placeholder="Which story is this image staging? Why is the main figure placed here? Which detail changes the source text?"
                className="field-gallery w-full resize-none rounded px-3 py-2 text-sm"
            />
          </>
        )}

        <button
          onClick={submit}
          disabled={loading}
            className="btn-gallery w-full rounded-full px-6 py-2.5 text-sm font-medium tracking-[0.12em] disabled:opacity-50"
        >
          {loading ? "Reading the painting…" : "Read the painting"}
        </button>
          {error && <p className="text-sm text-[var(--oxide)]">{error}</p>}
      </section>

        {loading && <LoadingOverlay visible={loading} paintingTitle={p.title} />}

        {result && !loading && (
          <section className="space-y-4">
            <div className="surface-gallery flex items-center justify-between rounded-[8px] px-4 py-3">
              <h2 className="text-sm font-medium tracking-[0.16em] text-[var(--vellum)]">Reading · {modeLabel(result.mode)}</h2>
            <button
              onClick={() => {
                setResult(null);
                setQuestion("");
                setRoamEntry("");
              }}
                className="text-xs text-[var(--muted)] underline underline-offset-4 hover:text-[var(--vellum)]"
            >
              Try another mode
            </button>
          </div>
          <InterpretationPanel
            mode={result.mode}
            result={result.result as never}
            onFollowUp={onFollowUp}
          />

            <SpiritPanel
            viewId={viewId}
            paintingId={p.id}
            paintingTitle={p.title}
            question={question}
            initialInterpretation={interpretationSummary}
          />
        </section>
      )}
      </aside>
    </div>
  );
}

function modeLabel(mode: ReadingMode): string {
  switch (mode) {
    case "beginner": return "First Encounter";
    case "scholar": return "Close Reading";
    case "roam": return "Roam";
    case "notes": return "Research Notes";
  }
}
