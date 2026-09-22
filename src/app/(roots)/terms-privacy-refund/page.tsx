import Link from 'next/link';
import { siteAddress, siteContact } from '@/constants/siteContact';

const sections = [
  { id: 'terms', label: 'Terms of Service' },
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'refund', label: 'Refund & Payment Policy' },
];

const TermsPrivacyRefundPage = () => {
  return (
    <main className="bg-slate-50">
      <section className="bg-gradient-to-r from-slate-950 via-[#073b82] to-[#0057c2] px-4 py-16 text-white md:px-8 md:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f5bd05]">
            CarClickBD policies
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            Terms, Privacy & Refund Policy
          </h1>
          <p className="mt-5 max-w-3xl text-base font-medium leading-8 text-blue-100 md:text-lg">
            Please read these policies before using CarClickBD or ordering an
            auction sheet verification service.
          </p>
          <p className="mt-5 text-sm font-semibold text-blue-200">
            Last updated: August 10, 2026
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:px-8 lg:grid-cols-[240px_1fr]">
        <nav className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
          <p className="px-3 pb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            On this page
          </p>
          <div className="space-y-1">
            {sections.map(section => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block rounded-xl px-3 py-3 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-[#003399]"
              >
                {section.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="space-y-8">
          <section id="terms" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#e50914]">
              01 · Terms of Service
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">Using CarClickBD</h2>
            <p className="mt-4 leading-8 text-slate-600">
              By using CarClickBD, you agree to use the website lawfully and
              provide accurate information. You must be at least 18 years old
              or use the service with the involvement of a legal guardian.
            </p>
            <div className="mt-6 space-y-5 text-slate-700">
              <div>
                <h3 className="font-black text-slate-950">Vehicle listings</h3>
                <p className="mt-2 leading-7">
                  Sellers are responsible for the accuracy of their vehicle
                  information, photos, price, mileage, chassis number and
                  documents. CarClickBD is a marketplace and does not guarantee
                  the condition, ownership or legality of a listed vehicle.
                </p>
              </div>
              <div>
                <h3 className="font-black text-slate-950">Auction sheet verification</h3>
                <p className="mt-2 leading-7">
                  Auction data is supplied from available third-party records
                  and may require manual review. A chassis search or displayed
                  vehicle information should not replace your own inspection,
                  document verification or professional advice.
                </p>
              </div>
              <div>
                <h3 className="font-black text-slate-950">Acceptable use</h3>
                <p className="mt-2 leading-7">
                  Do not submit false information, misuse another person&apos;s
                  data, interfere with the website, attempt unauthorized access
                  or use CarClickBD for fraudulent activity.
                </p>
              </div>
            </div>
          </section>

          <section id="privacy" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#e50914]">
              02 · Privacy Policy
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">How we use your information</h2>
            <p className="mt-4 leading-8 text-slate-600">
              We collect information you submit, such as your name, email,
              mobile number, address, chassis number and messages, to provide
              requested services and communicate with you.
            </p>
            <ul className="mt-6 list-disc space-y-3 pl-6 leading-7 text-slate-700">
              <li>Payment details are processed by our payment provider; CarClickBD does not store your wallet PIN or OTP.</li>
              <li>We may share necessary information with payment, hosting, communication and verification service providers.</li>
              <li>We may retain order, support and payment records to provide the service, prevent fraud and meet legal obligations.</li>
              <li>You may contact us to request correction of your personal information or ask questions about its use.</li>
            </ul>
            <p className="mt-6 leading-7 text-slate-600">
              We use reasonable safeguards, but no internet transmission or
              storage system can be guaranteed completely secure.
            </p>
          </section>

          <section id="refund" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#e50914]">
              03 · Refund & Payment Policy
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">Auction sheet verification payments</h2>
            <div className="mt-6 space-y-5 leading-7 text-slate-700">
              <div>
                <h3 className="font-black text-slate-950">Before delivery</h3>
                <p className="mt-2">
                  If payment is completed but CarClickBD cannot provide the
                  requested auction sheet because of a service or technical
                  issue, contact us with your order reference. We will review
                  the case and arrange a refund or an appropriate resolution.
                </p>
              </div>
              <div>
                <h3 className="font-black text-slate-950">After delivery</h3>
                <p className="mt-2">
                  Once the requested auction sheet has been delivered or made
                  available for download, the service is considered fulfilled
                  and the payment is generally non-refundable.
                </p>
              </div>
              <div>
                <h3 className="font-black text-slate-950">Duplicate or failed payments</h3>
                <p className="mt-2">
                  Duplicate charges and payments marked successful by your
                  provider but not received by us will be investigated. Any
                  approved refund is sent through the original payment method
                  and may require the provider&apos;s processing time.
                </p>
              </div>
              <div>
                <h3 className="font-black text-slate-950">How to request help</h3>
                <p className="mt-2">
                  Send your order ID, chassis number, payment reference and
                  contact details to us as soon as possible. Do not send your
                  wallet PIN, OTP or password.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-blue-100 bg-blue-50 p-6 md:p-8">
            <h2 className="text-2xl font-black text-slate-950">Questions about these policies?</h2>
            <p className="mt-3 leading-7 text-slate-700">
              Contact {siteContact.company} at{' '}
              <a className="font-bold text-[#003399] underline" href={`mailto:${siteContact.email}`}>
                {siteContact.email}
              </a>{' '}
              or WhatsApp {siteContact.whatsapp}. Our address is {siteAddress}.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/verify-auction-sheet" className="rounded-xl bg-[#f5bd05] px-5 py-3 text-sm font-black text-slate-950">
                Verify Auction Sheet
              </Link>
              <Link href="/contact" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-800">
                Contact CarClickBD
              </Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default TermsPrivacyRefundPage;
