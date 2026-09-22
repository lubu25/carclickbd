import { DetailsProductItems } from "./DetailsProductItems";

interface VehicleDetailsProps {
  highlights?: string[];
  equipment?: string[];
  accessories?: string[] | string;
  optionsList?: string[] | string;
  optionsText?: string;
  options?: string;
  additionalOptions?: string;
  modification?: string[];
  recentServiceHistory?: string[];
  otherItemsIncludedInSale?: string[];
  sellerNotes?: string[];
  videos?: string[];
  featuresAndOptions?: string[] | string;
  featuresOptions?: string[] | string;
}

const normalizeItems = (...values: unknown[]) => {
  const items = values.flatMap((value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") return value.split(/\r?\n|,/);
    return [];
  });

  return Array.from(
    new Set(
      items
        .map((item) => String(item).trim())
        .filter(Boolean)
    )
  );
};

export function DetailProductItemParents({
  product,
}: {
  product: VehicleDetailsProps;
}) {
  const sections = [
    {
      title: "Features",
      items: normalizeItems(
        product?.featuresAndOptions,
        product?.featuresOptions,
        product?.equipment,
        product?.highlights
      ),
    },
    {
      title: "Accessories",
      items: normalizeItems(product?.accessories, product?.optionsList),
    },
    {
      title: "Options",
      items: normalizeItems(
        product?.optionsText,
        product?.options,
        product?.additionalOptions
      ),
    },
    { title: "Modifications", items: product?.modification },
    { title: "Recent Service History", items: product?.recentServiceHistory },
    {
      title: "Other Items Included in Sale",
      items: product?.otherItemsIncludedInSale,
    },
    { title: "Seller Notes", items: product?.sellerNotes },
  ].filter((section) => section.items?.length);

  if (!sections.length) return null;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">
        Vehicle Equipment
      </p>
      <h2 className="mt-1 text-2xl font-extrabold text-slate-950">
        Accessories, features & options
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {sections.map((section) => (
          <DetailsProductItems
            key={section.title}
            title={section.title}
            items={section.items || []}
          />
        ))}
      </div>
    </section>
  );
}
