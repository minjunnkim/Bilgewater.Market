"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-parchment">
          Sanity not connected
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-wake">
          Create a Sanity project, then set{" "}
          <code className="text-brass">NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
          <code className="text-brass">NEXT_PUBLIC_SANITY_DATASET</code> in{" "}
          <code className="text-brass">.env.local</code>. Restart the dev server
          and reload this page to open the inventory dashboard.
        </p>
        <p className="mt-6 text-xs text-wake/70">
          Until then, the public site uses sample inventory so you can keep
          building the UI.
        </p>
      </div>
    );
  }

  return <NextStudio config={config} />;
}
