import Link from "next/link";
import { CheckCircle, ShieldCheck, UserRound } from "lucide-react";
import AuthAwareSignupLink from "@/components/auth/AuthAwareSignupLink";

const rules = [
  "List only vehicles you own or are legally authorized to sell.",
  "Use real photos of the vehicle and avoid edited or misleading images.",
  "Provide accurate mileage, registration, production year, chassis, and condition details.",
  "Keep price, location, and availability updated until the vehicle is sold or reserved.",
  "Respond honestly to buyer inquiries and share documents only through safe channels.",
];

const IndividualSellerRulesPage = () => {
  return (
    <main className="bg-slate-50 py-14 md:py-20">
      <section className="mx-auto max-w-5xl px-4 md:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 md:p-10">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#e50914] text-white">
              <UserRound size={28} />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#003399]">
                Individual Seller Rules
              </p>
              <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-5xl">
                Sell your own car with confidence.
              </h1>
            </div>
          </div>

          <p className="max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            Individual seller accounts are for private owners who want to list
            their own vehicle directly on CarClickBD.
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
                <h2 className="text-xl font-extrabold">Listing approval</h2>
                <p className="mt-2 text-sm leading-6 text-blue-50">
                  Your listing will be reviewed before going live so buyers can
                  trust the photos, details, and seller information.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AuthAwareSignupLink
              href="/individual-seller-signup"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[#e50914] px-6 text-sm font-extrabold text-white transition hover:bg-[#b80f17]"
            >
              Create Individual Seller Account
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

export default IndividualSellerRulesPage;
