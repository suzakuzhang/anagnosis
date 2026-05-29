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
    description: "Like a museum guide — warm, no jargon pile-up. ~600-900 words.",
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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {MODES.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={`text-left p-3 rounded border transition-colors ${
            value === m.id
              ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
              : "border-[var(--border)] hover:border-[var(--foreground)]"
          }`}
        >
          <div className="font-medium text-sm">{m.label}</div>
          <div className={`text-xs mt-1 leading-relaxed ${value === m.id ? "opacity-80" : "text-[var(--muted)]"}`}>
            {m.description}
          </div>
        </button>
      ))}
    </div>
  );
}
