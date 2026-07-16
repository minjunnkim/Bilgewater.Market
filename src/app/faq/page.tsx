import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Buying, shipping, and authenticity at Bilgewater Market.",
};

const faqs = [
  {
    category: "Buying",
    items: [
      {
        q: "How do I purchase a card?",
        a: "Open any listing and click Express Interest, or use the Contact page. Include your budget if you'd like to make an offer — many prices are negotiable.",
      },
      {
        q: "Do you negotiate?",
        a: "Yes. Send an offer with your budget and preferred contact method. We'll continue over email from there.",
      },
      {
        q: "What does POA mean?",
        a: "Price on application — inquire for current asking price. Often used for especially rare or graded pieces.",
      },
    ],
  },
  {
    category: "Authenticity",
    items: [
      {
        q: "Are cards verified?",
        a: "Every piece is personally inspected before listing. We only move genuine Riftbound cards.",
      },
      {
        q: "What is population?",
        a: "Population is the known or estimated number of that card in existence (or graded copies for slabs). Each listing shows when that figure was last updated.",
      },
    ],
  },
  {
    category: "Shipping",
    items: [
      {
        q: "How are cards shipped?",
        a: "Rigid protection (top loader / team bag), bubble wrap, padded mailer, and outer box as needed. All high-value shipments go fully insured.",
      },
      {
        q: "Do you hand-deliver?",
        a: "By arrangement, at the buyer's expense. Reach out if you want that option discussed.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-foam">FAQ</p>
      <h1 className="mt-3 font-display text-4xl text-parchment">
        Frequently asked
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-wake">
        Everything you need to know about buying and shipping with Bilgewater
        Market.
      </p>

      <div className="mt-12 space-y-12">
        {faqs.map((section) => (
          <section key={section.category}>
            <h2 className="font-display text-2xl text-brass">
              {section.category}
            </h2>
            <div className="mt-6 space-y-6">
              {section.items.map((item) => (
                <div
                  key={item.q}
                  className="border-t border-tide/25 pt-5"
                >
                  <h3 className="text-base font-medium text-parchment">
                    {item.q}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-wake">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 rounded-sm border border-tide/25 bg-harbor/40 p-6 text-center">
        <p className="font-display text-xl text-parchment">
          Still have questions?
        </p>
        <p className="mt-2 text-sm text-wake">
          Reach out directly — we&apos;ll get back promptly.
        </p>
        <Link
          href="/contact"
          className="mt-5 inline-block rounded-sm bg-brass px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-parchment"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
