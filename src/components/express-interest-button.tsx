"use client";

import { useEffect, useState } from "react";
import { InterestForm } from "./interest-form";

type Props = {
  cardName: string;
  cardId: string;
};

export function ExpressInterestButton({ cardName, cardId }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-sm bg-brass px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-parchment"
      >
        Express interest
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[350] flex items-end justify-center bg-ink/80 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="interest-dialog-title"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-sm border border-tide/30 bg-harbor p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="interest-dialog-title"
                  className="font-display text-2xl text-parchment"
                >
                  Express interest
                </h2>
                <p className="mt-1 text-sm text-wake">
                  Tell us about your offer or questions for this card.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-parchment/30 text-parchment transition hover:border-brass hover:text-brass"
                aria-label="Close"
              >
                <span aria-hidden className="text-lg leading-none">
                  ×
                </span>
              </button>
            </div>
            <div className="mt-5">
              <InterestForm cardName={cardName} cardId={cardId} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
