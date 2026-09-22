import { siteAddress, siteContact } from "@/constants/siteContact";

const CookiePolicyPage = () => {
  return (
    <main className="mx-auto max-w-4xl px-4 py-14 md:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">
        Legal
      </p>
      <h1 className="mt-2 text-4xl font-extrabold text-slate-950">
        Cookie Policy
      </h1>
      <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
        <p>
          CarClickBD may use cookies and similar technologies to improve site
          performance, remember preferences, understand traffic, and support a
          safer browsing experience.
        </p>
        <p>
          You can control cookies through your browser settings. Disabling some
          cookies may affect login, saved preferences, or certain site features.
        </p>
        <p>
          For privacy questions, contact {siteContact.company} at {siteContact.email},
          WhatsApp {siteContact.whatsapp}, or {siteAddress}.
        </p>
      </div>
    </main>
  );
};

export default CookiePolicyPage;
