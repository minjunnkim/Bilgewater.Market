import Link from "next/link";
import { SubscribeForm } from "./subscribe-form";
import type { SiteSettings } from "@/lib/types";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-auto border-t border-tide/15 bg-ink/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl text-parchment">Bilgewater Market</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-wake">
            {settings.homepageBlurb ||
              "Premium Riftbound TCG. Verified cards, direct inquiries, weekly inventory updates."}
          </p>
          <div className="mt-6">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-foam">
              Weekly inventory list
            </p>
            <SubscribeForm compact />
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-foam">Navigate</p>
          <ul className="mt-4 space-y-2 text-sm text-wake">
            <li>
              <Link href="/inventory" className="hover:text-parchment">
                Inventory
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-parchment">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-parchment">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-foam">Contact</p>
          <p className="mt-4 text-sm text-wake">
            {settings.contactEmail || "hello@bilgewater.market"}
          </p>
          {settings.shippingNote ? (
            <p className="mt-3 text-sm leading-relaxed text-wake/80">
              {settings.shippingNote}
            </p>
          ) : null}
        </div>
      </div>
      <div className="border-t border-tide/15 py-4 text-center text-xs text-wake/70">
        © {new Date().getFullYear()} Bilgewater Market. All rights reserved.
      </div>
    </footer>
  );
}
