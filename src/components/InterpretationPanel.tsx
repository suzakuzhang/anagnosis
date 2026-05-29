"use client";

import type { ReadingMode } from "@/types/painting";

interface SevenLayerOutput {
  first_glance: string;
  viewing_path: string;
  brushwork_and_space: string;
  inscriptions_and_seals: string;
  symbol_and_context: string;
  emotional_field: string;
  follow_up_questions: string[];
}

interface RoamOutput {
  entry_point: string;
  walk_through: string;
  visual_anchor_back: string;
}

interface NotesOutput {
  markdown: string;
}

interface InterpretationPanelProps {
  mode: ReadingMode;
  result: SevenLayerOutput | RoamOutput | NotesOutput;
  onFollowUp?: (question: string) => void;
}

const LAYER_LABELS: { key: keyof SevenLayerOutput; label: string }[] = [
  { key: "first_glance", label: "First glance" },
  { key: "viewing_path", label: "Viewing path" },
  { key: "brushwork_and_space", label: "Form & technique" },
  { key: "inscriptions_and_seals", label: "Inscriptions & text" },
  { key: "symbol_and_context", label: "Symbol & cultural context" },
  { key: "emotional_field", label: "Emotional field" },
];

export default function InterpretationPanel({ mode, result, onFollowUp }: InterpretationPanelProps) {
  if (mode === "roam") {
    const r = result as RoamOutput;
    return (
      <article className="space-y-6">
        <Section label="Entry point" body={r.entry_point} />
        <Section label="Along the way" body={r.walk_through} />
        <Section label="Back to the picture" body={r.visual_anchor_back} />
      </article>
    );
  }

  if (mode === "notes") {
    const r = result as NotesOutput;
    return (
      <article className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--muted)]">Research Notes (Markdown)</h3>
          <button
            onClick={() => navigator.clipboard.writeText(r.markdown)}
            className="text-xs text-[var(--muted)] underline hover:text-[var(--foreground)]"
          >
            Copy all
          </button>
        </div>
        <pre className="text-sm leading-7 whitespace-pre-wrap bg-gray-50 p-4 rounded border border-[var(--border)] font-mono overflow-x-auto">
          {r.markdown}
        </pre>
      </article>
    );
  }

  // beginner / scholar — 7-layer
  const r = result as SevenLayerOutput;
  return (
    <article className="space-y-6">
      {LAYER_LABELS.map(({ key, label }) => {
        const text = r[key];
        if (!text || typeof text !== "string") return null;
        return <Section key={key} label={label} body={text} />;
      })}

      {Array.isArray(r.follow_up_questions) && r.follow_up_questions.length > 0 && (
        <section className="space-y-2 pt-3 border-t border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--muted)]">You can keep asking</h3>
          <div className="space-y-2">
            {r.follow_up_questions.map((q, i) => (
              <button
                key={i}
                onClick={() => onFollowUp?.(q)}
                disabled={!onFollowUp}
                className="block w-full text-left text-sm leading-relaxed border border-[var(--border)] rounded px-3 py-2 hover:border-[var(--foreground)] hover:bg-gray-50 disabled:cursor-default disabled:hover:border-[var(--border)] disabled:hover:bg-transparent transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function Section({ label, body }: { label: string; body: string }) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold text-[var(--muted)]">{label}</h3>
      <p className="text-base leading-8 whitespace-pre-wrap">{body}</p>
    </section>
  );
}
