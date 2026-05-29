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
      <body className="min-h-screen">
        <header className="border-b border-[var(--border)] px-6 py-4">
          <nav className="max-w-5xl mx-auto flex items-center gap-6">
            <a href="/" className="text-lg font-semibold tracking-wide">
              Anagnosis
            </a>
            <a href="/gallery" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
              Gallery
            </a>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-8">
          {children}
        </main>
        <footer className="border-t border-[var(--border)] px-6 py-4 mt-8">
          <div className="max-w-5xl mx-auto text-center text-xs text-[var(--muted)]">
            <span>Anagnosis · A research prototype on AI-mediated seeing</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
