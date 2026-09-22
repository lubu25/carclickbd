"use client";

const getValue = (...values: any[]) =>
  values.find((value) => value !== undefined && value !== null && value !== "") ||
  "N/A";

const getNumericPrice = (product: any) => {
  const value =
    product?.mainPrice ||
    product?.price ||
    product?.fixedPrice ||
    product?.highestBid ||
    product?.minBid ||
    0;
  const numeric = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
};

const formatBdt = (value: number) =>
  `BDT ${Math.max(0, Math.round(value)).toLocaleString("en-US")}/-`;

export default function VehicleDetails({ product }: { product: any }) {
  const price = getNumericPrice(product);
  const specs = [
    ["Title", product?.title],
    ["Maker", getValue(product?.maker, product?.make)],
    ["Model", product?.model],
    ["Model Code", product?.modelCode],
    ["Grade", product?.grade],
    ["Production Year", getValue(product?.productionYear, product?.year, product?.launchingYear)],
    ["Registration Year", product?.registrationYear],
    ["Reference Number", getValue(product?.stockNumber, product?.referenceNumber)],
    ["Mileage", product?.mileage ? `${product.mileage} km` : undefined],
    ["Engine CC", getValue(product?.engineCc, product?.engineCC, product?.engineSize, product?.engine)],
    ["Fuel Type", getValue(product?.fuelType, product?.fuel)],
    ["Transmission", product?.transmission],
    ["Drive Type", getValue(product?.driveType, product?.drivetrain, product?.drive)],
    ["Body Type", getValue(product?.bodyType, product?.bodyStyle)],
    ["Color", getValue(product?.color, product?.exteriorColor)],
    ["Chassis Number", getValue(product?.vinChassisNumber, product?.vin)],
    ["Auction Grade", product?.auctionGrade],
    ["Condition", getValue(product?.condition, product?.titleStatus)],
    [
      "Location",
      [product?.location?.city, product?.location?.zipCode].filter(Boolean).join(", "),
    ],
  ].filter(([, value]) => value && value !== "N/A");

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">
            Specification
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-950">
            Vehicle details
          </h2>
        </div>
        <div className="rounded-lg border border-[#f0b90b]/60 bg-gradient-to-br from-[#fff8df] to-white px-5 py-4 shadow-[0_14px_35px_rgba(245,189,5,0.16)] md:min-w-[260px]">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#003399]">
            Vehicle price
          </p>
          <p className="mt-1 text-2xl font-black leading-none text-slate-950">
            {formatBdt(price)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {specs.map(([label, value]) => (
          <div
            key={label}
            className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
              {label}
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
