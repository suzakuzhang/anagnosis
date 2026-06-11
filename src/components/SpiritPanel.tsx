"use client";

import { useState, useRef, useEffect } from "react";

interface SpiritPanelProps {
  viewId: string;
  paintingId: string;
  paintingTitle: string;
  question: string;
  initialInterpretation?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function SpiritPanel(props: SpiritPanelProps) {
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "active" | "ended">("idle");
  const [remaining, setRemaining] = useState(8);
  const [expiresAt, setExpiresAt] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expiresAt || status !== "active") return;
    const interval = setInterval(() => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Timed out");
        setStatus("ended");
        clearInterval(interval);
      } else {
        const min = Math.floor(diff / 60000);
        const sec = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${min}:${sec.toString().padStart(2, "0")}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, status]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startSession = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/spirit/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          viewId: props.viewId,
          paintingId: props.paintingId,
          question: props.question,
          initialInterpretation: props.initialInterpretation,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSessionId(data.session.sessionId);
        setStatus("active");
        setRemaining(data.session.remainingRounds);
        setExpiresAt(data.session.expiresAt);
        setMessages([{ role: "assistant", content: data.openingMessage }]);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || !sessionId || status !== "active") return;
    const msg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/spirit/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: msg }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        setRemaining(data.remainingRounds);
        if (data.status !== "active") setStatus("ended");
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.error ?? "Reply failed" }]);
        if (data.status) setStatus("ended");
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error" }]);
    }
    setLoading(false);
  };

  const endSession = async () => {
    if (!sessionId) return;
    try {
      const res = await fetch("/api/spirit/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (data.farewell) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.farewell }]);
      }
    } catch { /* ignore */ }
    setStatus("ended");
  };

  if (status === "idle") {
    return (
      <section>
        <button
          onClick={startSession}
          disabled={loading}
          className="w-full rounded-[6px] border border-[var(--gold)] px-4 py-4 text-base font-medium text-[var(--vellum)] transition-all hover:bg-[rgba(197,162,96,0.12)] active:scale-[0.99]"
        >
          {loading ? "The guide steps forward…" : `Ask the guide to keep looking at “${props.paintingTitle}” with you`}
          <span className="block text-xs font-normal opacity-60 mt-0.5">companion guide · grounded in the painting, not a free-floating persona · 10 min · 8 turns</span>
        </button>
      </section>
    );
  }

  return (
    <section className="surface-gallery rounded-[6px]">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-sm">Guide · {props.paintingTitle}</h2>
          {status === "active" && (
            <span className="text-xs text-[var(--muted)]">
              {timeLeft} | {remaining} turns left
            </span>
          )}
          {status === "ended" && (
            <span className="text-xs text-[var(--muted)]">Ended</span>
          )}
        </div>
        {status === "active" && (
          <button onClick={endSession} className="text-xs text-[var(--muted)] hover:text-[var(--oxide)]">
            End conversation
          </button>
        )}
      </div>

      <div className="overflow-y-auto px-4 py-3 space-y-4" style={{ maxHeight: "32rem" }}>
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : ""}>
            <div
              className={`text-sm leading-7 rounded-lg px-4 py-3 inline-block text-left ${
                m.role === "user"
                  ? "bg-[var(--gold)] text-[#101112]"
                  : "bg-black/35 text-[var(--vellum-dim)]"
              }`}
              style={{
                maxWidth: "90%",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {status === "active" && (
        <div className="flex gap-2 px-4 py-3 border-t border-[var(--border)]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && sendMessage()}
            placeholder="Keep asking…"
            maxLength={300}
            disabled={loading}
            className="field-gallery flex-1 rounded px-3 py-1.5 text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="btn-gallery rounded px-4 py-1.5 text-sm disabled:opacity-50"
          >
            {loading ? "…" : "Send"}
          </button>
        </div>
      )}
    </section>
  );
}
