"use client";

import { useEffect, useState } from "react";

interface PaintingBrief {
  id: string;
  title: string;
  alt_titles?: string[];
  series: string | null;
  image_path: string;
  medium: string;
  dimensions: string;
  format: string;
  collection: string;
  approximate_date?: string;
  subject_class: string[];
  reading_lenses: string[];
}

export default function GalleryPage() {
  const [items, setItems] = useState<PaintingBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeSubject, setActiveSubject] = useState<string>("");

  const fetchPaintings = async (q = "", subject = "") => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (subject) params.set("subject", subject);
    const res = await fetch(`/api/paintings?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setItems(data.items ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPaintings();
  }, []);

  // Aggregate subject classes from current items for filter chips
  const allSubjects = Array.from(
    new Set(items.flatMap((p) => p.subject_class))
  ).sort();

  return (
    <div className="mx-auto max-w-7xl space-y-7 px-6 py-9">
      <section className="flex flex-col gap-3 border-b border-[var(--border)] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs tracking-[0.34em] text-[var(--muted)]">GALLERY</p>
          <h1 className="mt-2 text-3xl font-medium tracking-[0.16em] text-[var(--vellum)]">Paintings</h1>
        </div>
        <p className="max-w-xl text-sm leading-7 text-[var(--muted)]">
          A seed corpus of Western Old-Master paintings, anchored in de Rynck, Panofsky, and Baxandall.
          Open a work and the painting stays in the viewing room while the guide works beside it.
        </p>
      </section>

      {/* Search + Filters */}
      <div className="surface-gallery space-y-3 rounded-[6px] p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchPaintings(query, activeSubject)}
            placeholder="Search title, collection, visible elements…"
            className="field-gallery flex-1 rounded px-3 py-2 text-sm"
          />
          <button
            onClick={() => fetchPaintings(query, activeSubject)}
            className="btn-gallery rounded px-4 py-2 text-sm"
          >
            Search
          </button>
        </div>

        {allSubjects.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setActiveSubject("");
                fetchPaintings(query, "");
              }}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                activeSubject === ""
                  ? "border-[var(--gold)] bg-[rgba(197,162,96,0.16)] text-[var(--vellum)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--vellum)]"
              }`}
            >
              All
            </button>
            {allSubjects.map((s) => (
              <button
                key={s}
                onClick={() => {
                  const next = activeSubject === s ? "" : s;
                  setActiveSubject(next);
                  fetchPaintings(query, next);
                }}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  activeSubject === s
                    ? "border-[var(--gold)] bg-[rgba(197,162,96,0.16)] text-[var(--vellum)]"
                    : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--vellum)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-sm text-[var(--muted)]">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">No matching paintings.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((p) => (
            <a
              key={p.id}
              href={`/painting/${p.id}`}
              className="group surface-gallery block overflow-hidden rounded-[6px] transition-colors hover:border-[var(--gold)]"
            >
              <div className="aspect-[4/5] overflow-hidden bg-black/30">
                <img
                  src={p.image_path}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-3 space-y-1">
                <h3 className="text-sm font-medium leading-tight text-[var(--vellum)]">{p.title}</h3>
                <p className="text-xs text-[var(--muted)] truncate">{p.collection}</p>
                <p className="text-xs text-[var(--muted)]">{p.medium} · {p.dimensions}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
