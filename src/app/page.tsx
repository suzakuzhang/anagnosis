export default function Home() {
  return (
    <div className="min-h-[calc(100vh-104px)]">
      <section className="relative isolate overflow-hidden border-b border-[var(--border)]">
        <img
          src="/paintings/anagnosis/vermeer-milkmaid.jpg"
          alt=""
          className="absolute inset-y-0 right-0 -z-10 h-full w-full object-cover opacity-20 blur-[1px] saturate-75 md:w-[56%] md:opacity-42"
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_74%_30%,rgba(197,162,96,0.16),transparent_34%),linear-gradient(90deg,var(--ink)_0%,rgba(8,9,10,0.96)_46%,rgba(8,9,10,0.58)_100%)]" />

        <div className="mx-auto grid min-h-[72vh] max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-[0.95fr_1.05fr]">
          <div className="gallery-rise max-w-2xl space-y-7">
            <p className="text-xs tracking-[0.42em] text-[var(--muted)]">AI-MEDIATED SEEING</p>
            <h1 className="text-5xl font-medium tracking-[0.2em] text-[var(--vellum)] md:text-7xl">Anagnosis</h1>
            <p className="max-w-xl text-lg leading-9 text-[var(--vellum-dim)]">
              A companion for reading paintings. It keeps the image in view while interpretation is assembled from
              composition, iconography, detail, and historical context.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href="/gallery" className="btn-gallery rounded-full px-6 py-3 text-sm font-medium tracking-[0.12em]">
                Enter Gallery
              </a>
              <a
                href="/painting/vermeer-milkmaid"
                className="rounded-full border border-[var(--border)] px-6 py-3 text-sm tracking-[0.12em] text-[var(--vellum-dim)] transition-colors hover:border-[var(--gold)] hover:text-[var(--vellum)]"
              >
                Read The Milkmaid
              </a>
            </div>
          </div>

          <div className="surface-gallery gallery-rise rounded-[6px] p-4 md:p-5">
            <div className="overflow-hidden rounded-[4px] bg-black/35">
              <img
                src="/paintings/anagnosis/vermeer-milkmaid.jpg"
                alt="The Milkmaid"
                className="mx-auto max-h-[64vh] w-full object-contain"
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 text-xs text-[var(--muted)]">
              <span>Vermeer · The Milkmaid</span>
              <span className="text-[var(--gold)]">image fixed · guide beside it</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-10 md:grid-cols-4">
        {[
          ["First Encounter", "A clear museum-style opening."],
          ["Close Reading", "Source, iconography, and context."],
          ["Roam", "Enter through one visual detail."],
          ["Research Notes", "A Markdown scaffold for writing."],
        ].map(([title, body]) => (
          <div key={title} className="border-l border-[var(--border)] py-2 pl-4">
            <h2 className="text-sm font-medium tracking-[0.18em] text-[var(--vellum)]">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
