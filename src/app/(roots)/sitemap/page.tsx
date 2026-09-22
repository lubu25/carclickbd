import Link from "next/link";

const sitemapSections = [
  {
    title: "Inventory",
    links: [
      ["Browse Cars", "/cars"],
      ["Featured Cars", "/cars"],
      ["Sold Cars", "/cars?status=sold"],
    ],
  },
  {
    title: "Tools",
    links: [
      ["Duty Calculator", "/duty-calculator"],
      ["Verify Auction Sheet", "/verify-auction-sheet"],
      ["Production Year Check", "https://www.jp.center/month"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Help", "/help"],
      ["Support", "/support"],
      ["Shipping", "/shipping"],
      ["SafePay", "/safepay"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Blog", "/blog"],
      ["Community", "/community"],
      ["Terms", "/terms-service"],
      ["Privacy", "/privacy-policy"],
      ["Cookie Policy", "/cookie-policy"],
    ],
  },
];

const SitemapPage = () => {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 md:px-8">
      <h1 className="text-4xl font-extrabold text-slate-950">Sitemap</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {sitemapSections.map((section) => (
          <section key={section.title} className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="font-extrabold text-slate-950">{section.title}</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {section.links.map(([label, href]) => (
                <li key={href}>
                  {href.startsWith("http") ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-slate-600 hover:text-sky-600"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link href={href} className="font-medium text-slate-600 hover:text-sky-600">
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
};

export default SitemapPage;
