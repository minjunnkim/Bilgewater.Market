import type { Metadata } from "next";
import { InterestForm } from "@/components/interest-form";
import { getSiteSettings } from "@/lib/sanity.client";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Bilgewater Market.",
};

export const revalidate = 60;

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-foam">Contact</p>
        <h1 className="mt-3 font-display text-4xl text-parchment">
          Get in touch
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-wake sm:text-base">
          Purchase inquiry, commission request, or a general question — send a
          message and we&apos;ll reply as soon as we can.
        </p>
        <dl className="mt-10 space-y-6 border-t border-tide/25 pt-8 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-foam">
              Email
            </dt>
            <dd className="mt-1 text-parchment">
              {settings.contactEmail || "hello@bilgewater.market"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-foam">
              Response
            </dt>
            <dd className="mt-1 text-wake">Typically within 24 hours</dd>
          </div>
          {settings.shippingNote ? (
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-foam">
                Shipping
              </dt>
              <dd className="mt-1 text-wake">{settings.shippingNote}</dd>
            </div>
          ) : null}
        </dl>
      </div>
      <div className="rounded-sm border border-tide/25 bg-harbor/40 p-6 sm:p-8">
        <InterestForm />
      </div>
    </div>
  );
}
