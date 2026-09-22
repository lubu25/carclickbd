"use client";

import { Collapse } from "antd";
import { ShieldCheck } from "lucide-react";

const faqData = [
  {
    question: "Why is the seller's phone number hidden?",
    answer:
      "To protect the privacy of both buyers and sellers and keep communication secure. CarClickBD manages inquiries until both sides are ready to proceed.",
  },
  {
    question: "How can I contact the seller?",
    answer:
      "Use the Contact Seller or Chat option on the vehicle listing. The CarClickBD team will help connect you with the seller.",
  },
  {
    question: "Can I buy a car directly from the seller?",
    answer:
      "Yes. CarClickBD is a marketplace that connects buyers and sellers. The final inspection, agreement, and payment are handled between both parties.",
  },
  {
    question: "How do I know if a listing is genuine?",
    answer:
      "We review listings to help maintain quality, but buyers should always inspect the vehicle, verify ownership documents, and confirm all details before purchasing.",
  },
  {
    question: "Is it safe to pay a deposit in advance?",
    answer:
      "No. Never send money or pay a deposit to a seller before inspecting the vehicle and verifying all documents.",
  },
  {
    question: "Where should I meet the seller?",
    answer:
      "Meet at a safe public location or at the seller's dealership. If possible, bring someone with you and inspect the vehicle in daylight.",
  },
  {
    question: "What should I check before buying?",
    answer:
      "Inspect the car's condition, verify registration or ownership documents, check service history if available, and take a test drive whenever possible.",
  },
  {
    question: "When should I make the payment?",
    answer:
      "Make payment only after you are fully satisfied with the vehicle, all documents have been verified, and both parties have agreed to the terms.",
  },
  {
    question: "Does CarClickBD guarantee the condition of listed vehicles?",
    answer:
      "No. CarClickBD provides the marketplace to connect buyers and sellers. Buyers are responsible for inspecting the vehicle and verifying all information before purchase.",
  },
  {
    question: "What should I do if I see suspicious activity?",
    answer:
      "Report the listing or conversation to CarClickBD immediately. Avoid sharing personal financial information or making payments outside the recommended process.",
  },
];

export default function FAQSection() {
  return (
    <section className="rounded-2xl bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-[#f0b90b]/40 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#003399] shadow-sm">
            <ShieldCheck size={15} />
            CarClickBD FAQ
          </div>
          <h2 className="text-3xl font-extrabold text-slate-950 md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-600">
            Clear answers for safer buying, seller communication, vehicle
            inspection, and payment decisions on CarClickBD.
          </p>
        </div>

        <Collapse
          accordion
          bordered={false}
          className="faq-collapse bg-transparent"
          items={faqData.map((item, index) => ({
            key: String(index),
            label: (
              <span className="text-base font-bold text-slate-950">
                {item.question}
              </span>
            ),
            children: (
              <p className="mb-0 text-sm leading-7 text-slate-600">
                {item.answer}
              </p>
            ),
            className:
              "mb-3 rounded-xl border border-slate-200 bg-white px-2 shadow-sm",
          }))}
        />
      </div>
    </section>
  );
}
