import Link from "next/link";

const highlights = [
  ["Verified Listings", "Detailed vehicle information, clear photos, and accurate documentation."],
  ["Seller Tools", "Dealers can manage inventory and private sellers can upload up to 40 photos."],
  ["Buyer Confidence", "Contact sellers directly through inquiries and WhatsApp before making a decision."],
];

const categories = [
  "New cars",
  "Reconditioned cars",
  "Local used cars",
  "Motorcycles",
  "Trucks",
  "SUVs",
];

const AboutPage = () => {
  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="rounded-lg bg-slate-950 p-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f0b90b]">
              About CarClickBD
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              What is CarClickBD?
            </h1>
            <p className="mt-6 text-sm leading-7 text-slate-300 md:text-base">
              <span className="font-bold text-[#f0b90b]">CarClickBD</span> is an
              innovative online car marketplace designed to make buying and
              selling vehicles easier, faster, and more transparent for everyone.
              From car enthusiasts and small business owners to professional
              dealers, CarClickBD offers a single, trusted platform to connect
              buyers and sellers around the world.
            </p>
            <p className="mt-5 text-sm leading-7 text-slate-300 md:text-base">
              By combining technology with transparency, CarClickBD gives buyers
              more control and sellers more visibility. Join our growing
              community to experience the next generation of digital vehicle
              trading, where trust, speed, and value come together.
            </p>
            <Link
              href="/cars"
              className="mt-8 inline-flex rounded-md bg-[#e50914] px-6 py-3 text-sm font-black text-white transition hover:bg-[#b80f17]"
            >
              Browse Cars
            </Link>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm md:p-10">
              <h2 className="text-2xl font-black text-slate-950">
                A trusted vehicle marketplace for Bangladesh.
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                We specialize in a wide range of listings including{" "}
                <span className="font-bold text-slate-950">
                  new cars, reconditioned cars, local used cars, motorcycles,
                  trucks, and SUVs
                </span>
                . Every week, verified vehicles are listed by dealers and
                private sellers, each with detailed condition reports, clear
                photos, and accurate documentation so buyers can inquire with
                confidence.
              </p>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Whether you are buying your first car, expanding your fleet, or
                restoring classics, CarClickBD provides useful tools such as
                smart filters, watchlists, vehicle alerts, finance tools, TRUE
                REPORT support, auction sheet verification, and easy online
                inquiry options.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {highlights.map(([title, description]) => (
                <div
                  key={title}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <h3 className="font-black text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {description}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">
                Marketplace Categories
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
