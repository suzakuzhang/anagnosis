"use client";

import { useEffect, useState, useRef } from "react";

const LOADING_STATES = [
  "Walking up to the painting…",
  "Organizing the visual evidence into a viewing path…",
  "Generating the reading…",
];

const COMMON_FACTS = [
  `de Rynck's usual opening move is not to define first, but to ask: which story is this painting visualizing?`,
  `Panofsky reminds us to distinguish three layers: first see, then identify, then talk about deeper cultural meaning.`,
  `Baxandall's period eye is not empty talk about "the style of an era" — it asks: how were people of the time trained to look at pictures?`,
  `A detail that departs from the source text often matters more than a sweeping summary of the theme.`,
  `Who is enlarged, centered, raised, or darkened usually exposes a picture's hierarchy faster than the figures' names do.`,
  `Religious painting, history painting, and portraiture are not just subject categories — they are different protocols of looking.`,
  `Small objects are often not decoration: a lily, a skull, a palm branch, a crown, a book can all be iconographic IDs.`,
  `Size changes interpretation: an altarpiece, a small private devotional panel, and a public hall fresco were never meant to be seen from the same distance.`,
  `Close looking is not looking longer — it is knowing which detail is worth pausing on.`,
  `What Anagnosis cares about is not the "correct answer" but how interpretation gets assembled, step by step.`,
  `When a painter cuts something the story originally contained, that absence is speaking too.`,
  `Political subtext is not always shouted; it often hides in the patron, the place of display, and the arrangement of the figures.`,
];

interface LoadingOverlayProps {
  visible: boolean;
  paintingTitle?: string;
}

export default function LoadingOverlay({ visible, paintingTitle }: LoadingOverlayProps) {
  const [stateText, setStateText] = useState(LOADING_STATES[0]);
  const [fact, setFact] = useState("");
  const [progress, setProgress] = useState(0);
  const factPool = useRef<string[]>([]);
  const factIndex = useRef(0);

  useEffect(() => {
    if (!visible) {
      setProgress(0);
      return;
    }

    const pool = [...COMMON_FACTS];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    factPool.current = pool;
    factIndex.current = 0;
    setFact(pool[0] ?? "");

    setStateText(LOADING_STATES[0]);
    const t1 = setTimeout(() => setStateText(LOADING_STATES[1]), 2000);
    const t2 = setTimeout(() => setStateText(LOADING_STATES[2]), 4500);

    const factInterval = setInterval(() => {
      factIndex.current = (factIndex.current + 1) % factPool.current.length;
      setFact(factPool.current[factIndex.current]);
    }, 3000);

    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(95, (1 - Math.exp(-elapsed / 10000)) * 100);
      setProgress(p);
    }, 100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(factInterval);
      clearInterval(progressInterval);
    };
  }, [visible, paintingTitle]);

  if (!visible) return null;

  return (
    <div className="surface-gallery space-y-4 rounded-[6px] p-4" aria-live="polite">
      <p className="text-sm text-[var(--vellum-dim)] animate-pulse">{stateText}</p>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/40">
        <div
          className="h-full rounded-full bg-[var(--gold)] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-[var(--muted)] leading-relaxed min-h-[2.5rem] transition-opacity duration-500">
        {fact}
      </p>
    </div>
  );
}
