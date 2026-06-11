import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anagnosis — AI-mediated seeing prototype",
  description: "A research prototype for AI-mediated seeing, anchored in de Rynck, Panofsky, and Baxandall. It studies how interpretation is mediated through guided looking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[rgba(8,9,10,0.88)] px-5 py-3 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl items-center gap-6">
            <a href="/" className="text-base font-semibold tracking-[0.22em] text-[var(--vellum)] transition-colors hover:text-[var(--gold)]">
              Anagnosis
            </a>
            <a href="/gallery" className="text-xs tracking-[0.2em] text-[var(--muted)] transition-colors hover:text-[var(--vellum)]">
              Gallery
            </a>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="border-t border-[var(--border)] px-6 py-5">
          <div className="mx-auto max-w-7xl text-center text-xs text-[var(--muted)]">
            <span>Anagnosis · A research prototype on AI-mediated seeing</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
