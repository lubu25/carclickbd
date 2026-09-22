import Link from "next/link";
import { CheckCircle, ShieldCheck, Store } from "lucide-react";
import AuthAwareSignupLink from "@/components/auth/AuthAwareSignupLink";

const rules = [
  "Use a verified business name, contact number, and showroom or office address.",
  "Upload clear vehicle photos and accurate specifications for every listing.",
  "Do not publish misleading mileage, chassis, grade, price, or availability information.",
  "New listings stay pending until CarClickBD admin approval.",
  "Respond to buyer inquiries professionally and keep listing status updated.",
];

const DealerRulesPage = () => {
  return (
    <main className="bg-slate-50 py-14 md:py-20">
      <section className="mx-auto max-w-5xl px-4 md:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 md:p-10">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#e50914] text-white">
              <Store size={28} />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#003399]">
                Dealer Seller Rules
              </p>
              <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-5xl">
                Sell vehicles as a verified dealer.
              </h1>
            </div>
          </div>

          <p className="max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            Dealer accounts are built for showrooms, importers, and professional
            vehicle sellers. Please review these rules before creating your dealer
            account.
          </p>

          <div className="mt-8 grid gap-4">
            {rules.map((rule) => (
              <div
                key={rule}
                className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <CheckCircle className="mt-0.5 shrink-0 text-emerald-600" size={20} />
                <p className="font-medium leading-6 text-slate-700">{rule}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-[#003399] p-5 text-white">
            <div className="flex gap-3">
              <ShieldCheck className="mt-1 shrink-0 text-[#f0b90b]" size={24} />
              <div>
                <h2 className="text-xl font-extrabold">Approval note</h2>
                <p className="mt-2 text-sm leading-6 text-blue-50">
                  Dealer profile and listings may be reviewed by CarClickBD before
                  going live, keeping buyer trust high across the marketplace.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AuthAwareSignupLink
              href="/dealer-signup"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[#e50914] px-6 text-sm font-extrabold text-white transition hover:bg-[#b80f17]"
            >
              Create Dealer Account
            </AuthAwareSignupLink>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-300 px-6 text-sm font-bold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DealerRulesPage;
