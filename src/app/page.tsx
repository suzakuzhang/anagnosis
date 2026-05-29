export default function Home() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Anagnosis</h1>
        <p className="text-[var(--muted)] leading-relaxed text-base">
          A research prototype that operationalizes “how to read a painting” as a companion AI. It is in no hurry to hand you a verdict; instead it lets you see how interpretation is assembled, step by step, out of composition, iconography, detail, and historical context.
        </p>
        <p className="text-[var(--muted)] leading-relaxed text-sm">
          Its methodological anchors come from Patrick de Rynck, Erwin Panofsky, and Michael Baxandall.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/gallery"
          className="block border border-[var(--border)] rounded-lg p-6 hover:border-[var(--accent)] transition-colors"
        >
          <h2 className="font-semibold mb-2">Read a painting</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Choose a work from the gallery and read it at the depth you want.
          </p>
        </a>
      </div>

      <section className="space-y-3 pt-4 border-t border-[var(--border)]">
        <h3 className="text-sm font-semibold">Four reading modes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[var(--muted)]">
          <div><strong className="text-[var(--foreground)]">First Encounter</strong>: like a museum walkthrough — opens the picture up for you.</div>
          <div><strong className="text-[var(--foreground)]">Close Reading</strong>: connects the source text, iconography, and historical context.</div>
          <div><strong className="text-[var(--foreground)]">Roam</strong>: enter from a single detail and train your viewing path.</div>
          <div><strong className="text-[var(--foreground)]">Research Notes</strong>: export as Markdown you can keep working on.</div>
        </div>
      </section>

      <section className="text-xs text-[var(--muted)] space-y-1 pt-4 border-t border-[var(--border)]">
        <p>This project is a research prototype for the interpretation of visual culture. It is not a divination, fortune-telling, or psychological-counseling service.</p>
        <p>Every reading must return to visual evidence and clearly distinguish observation, inference, and what remains to be verified. If the AI oversteps, please let us know.</p>
        <p className="pt-2">
          <a href="/admin" className="underline hover:text-[var(--foreground)]">Admin</a>
        </p>
      </section>
    </div>
  );
}
