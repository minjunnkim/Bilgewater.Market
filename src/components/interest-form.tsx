"use client";

import { FormEvent, useState } from "react";

type Props = {
  cardName?: string;
  cardId?: string;
};

export function InterestForm({ cardName, cardId }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      budget: String(form.get("budget") || ""),
      message: String(form.get("message") || ""),
      cardName: cardName || String(form.get("cardName") || ""),
      cardId: cardId || "",
      website: String(form.get("website") || ""),
    };

    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      formEl.reset();
      setStatus("success");
      setMessage(data.message || "Message sent. We'll be in touch.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="animate-fade-up rounded-sm border border-tide/40 bg-harbor/60 p-6">
        <p className="font-display text-xl text-parchment">Message received</p>
        <p className="mt-2 text-sm text-wake">{message}</p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setMessage("");
          }}
          className="mt-4 text-xs uppercase tracking-[0.16em] text-brass hover:text-parchment"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      {!cardName ? (
        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-[0.16em] text-foam">
            Card of interest
          </span>
          <input
            name="cardName"
            placeholder="Optional"
            className="w-full rounded-sm border border-tide/30 bg-ink/60 px-3 py-2.5 text-sm text-parchment outline-none focus:border-brass/60"
          />
        </label>
      ) : (
        <p className="text-sm text-wake">
          Inquiring about{" "}
          <span className="text-parchment">{cardName}</span>
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-[0.16em] text-foam">
            Name *
          </span>
          <input
            name="name"
            required
            className="w-full rounded-sm border border-tide/30 bg-ink/60 px-3 py-2.5 text-sm text-parchment outline-none focus:border-brass/60"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-[0.16em] text-foam">
            Email *
          </span>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-sm border border-tide/30 bg-ink/60 px-3 py-2.5 text-sm text-parchment outline-none focus:border-brass/60"
          />
        </label>
      </div>
      <label className="block space-y-1.5">
        <span className="text-xs uppercase tracking-[0.16em] text-foam">
          Budget / offer
        </span>
        <input
          name="budget"
          placeholder="Optional"
          className="w-full rounded-sm border border-tide/30 bg-ink/60 px-3 py-2.5 text-sm text-parchment outline-none focus:border-brass/60"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-xs uppercase tracking-[0.16em] text-foam">
          Message *
        </span>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full resize-y rounded-sm border border-tide/30 bg-ink/60 px-3 py-2.5 text-sm text-parchment outline-none focus:border-brass/60"
        />
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-sm bg-brass px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-parchment disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
      {status === "error" && message ? (
        <p className="text-sm text-ember">{message}</p>
      ) : null}
    </form>
  );
}
