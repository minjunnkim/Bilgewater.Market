"use client";

import { FormEvent, useState } from "react";

export function SubscribeForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, website: "" }),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("success");
      setMessage(data.message || "You're on the list.");
      setEmail("");
      setName("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "space-y-2" : "space-y-3"}>
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      {!compact ? (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name (optional)"
          className="w-full rounded-sm border border-tide/30 bg-ink/60 px-3 py-2.5 text-sm text-parchment placeholder:text-wake/50 outline-none focus:border-brass/60"
        />
      ) : null}
      <div className={compact ? "flex gap-2" : "space-y-3"}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="w-full rounded-sm border border-tide/30 bg-ink/60 px-3 py-2.5 text-sm text-parchment placeholder:text-wake/50 outline-none focus:border-brass/60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-sm bg-brass px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition hover:bg-parchment disabled:opacity-60"
        >
          {status === "loading" ? "…" : "Join"}
        </button>
      </div>
      {message ? (
        <p
          className={`text-xs ${status === "error" ? "text-ember" : "text-foam"}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
