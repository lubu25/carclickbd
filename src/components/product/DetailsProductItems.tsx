import { Check } from "lucide-react";

interface DetailsSectionProps {
  title: string;
  items: string[];
}

export function DetailsProductItems({
  title,
  items = [],
}: DetailsSectionProps) {
  if (!items?.length) return null;

  return (
    <div>
      <h3 className="text-base font-extrabold text-slate-950">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex gap-2 text-sm font-medium text-slate-600">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <Check size={13} />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
