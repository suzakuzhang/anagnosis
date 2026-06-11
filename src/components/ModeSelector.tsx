"use client";

import type { ReadingMode } from "@/types/painting";

interface ModeSelectorProps {
  value: ReadingMode;
  onChange: (mode: ReadingMode) => void;
}

const MODES: { id: ReadingMode; label: string; description: string }[] = [
  {
    id: "beginner",
    label: "First Encounter",
    description: "A warm museum guide, with no jargon pile-up. ~600-900 words.",
  },
  {
    id: "scholar",
    label: "Close Reading",
    description: "An erudite scholarly close reading, citing art-historical and documentary sources. ~1500-2500 words.",
  },
  {
    id: "roam",
    label: "Roam",
    description: "Second-person guidance, entering from a point in the picture. ~500-800 words.",
  },
  {
    id: "notes",
    label: "Research Notes",
    description: "A saveable Markdown template, for writing.",
  },
];

export default function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
      {MODES.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={`min-h-[5.25rem] rounded-[5px] border p-3 text-left transition-colors ${
            value === m.id
              ? "border-[var(--gold)] bg-[rgba(197,162,96,0.16)] text-[var(--vellum)]"
              : "border-[var(--border)] text-[var(--vellum-dim)] hover:border-[var(--gold)] hover:text-[var(--vellum)]"
          }`}
        >
          <div className="text-sm font-medium tracking-[0.12em]">{m.label}</div>
          <div className={`text-xs mt-1 leading-relaxed ${value === m.id ? "opacity-80" : "text-[var(--muted)]"}`}>
            {m.description}
          </div>
        </button>
      ))}
    </div>
  );
}
