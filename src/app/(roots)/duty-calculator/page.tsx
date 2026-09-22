"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, Car, Calendar, Gauge, ShieldCheck } from "lucide-react";

const brands = [
  "Please Select A Brand",
  "TOYOTA",
  "NISSAN",
  "MITSUBISHI",
  "MAZDA",
  "LEXUS",
  "HONDA",
  "DAIHATSU",
  "SUZUKI",
  "SUBARU",
  "ISUZU",
  "BMW",
  "MERCEDES-BENZ",
  "AUDI",
  "VOLKSWAGEN",
  "PORSCHE",
  "LAND ROVER",
  "HYUNDAI",
  "KIA",
];

const modelsByBrand: Record<string, string[]> = {
  TOYOTA: ["PRIUS", "COROLLA CROSS", "AQUA", "HARRIER", "RAV4", "NOAH"],
  NISSAN: ["LEAF: 85 KW", "X-TRAIL", "NOTE", "SERENA", "JUKE"],
  MITSUBISHI: ["OUTLANDER", "ECLIPSE CROSS", "DELICA D:5", "PAJERO"],
  MAZDA: ["AXELA", "CX-5", "CX-30", "DEMIO"],
  LEXUS: ["RX", "NX", "ES", "CT"],
  HONDA: ["FIT e:HEV", "VEZEL", "CR-V", "GRACE", "FREED"],
  DAIHATSU: ["ROCKY", "TAFT", "MOVE", "MIRA"],
  SUZUKI: ["SWIFT", "SOLIO", "HUSTLER", "WAGON R"],
  SUBARU: ["FORESTER", "IMPREZA", "XV", "LEVORG"],
  ISUZU: ["D-MAX", "MU-X"],
  BMW: ["X1", "X3", "3 SERIES", "5 SERIES"],
  "MERCEDES-BENZ": ["C-CLASS", "E-CLASS", "GLA", "GLC"],
  AUDI: ["A3", "A4", "Q3", "Q5"],
  VOLKSWAGEN: ["GOLF", "TIGUAN", "PASSAT", "POLO"],
  PORSCHE: ["MACAN", "CAYENNE", "911"],
  "LAND ROVER": ["RANGE ROVER EVOQUE", "DISCOVERY", "DEFENDER"],
  HYUNDAI: ["TUCSON", "SANTA FE", "KONA"],
  KIA: ["SPORTAGE", "SORENTO", "NIRO"],
};

const grades = ["Please Select Grade", "ZAA-ZE1", "DAA", "6AA", "DBA", "3BA"];
const years = ["Please Select Model Year", "2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];
const engineSizes = ["Please Select Car CC", "660 cc", "1000 cc", "1200 cc", "1500 cc", "1800 cc", "2000 cc", "2500 cc", "3000 cc"];

const dutyBaseByCc: Record<string, number> = {
  "660 cc": 450000,
  "1000 cc": 650000,
  "1200 cc": 780000,
  "1500 cc": 950000,
  "1800 cc": 1250000,
  "2000 cc": 1550000,
  "2500 cc": 2150000,
  "3000 cc": 2950000,
};

const DutyCalculatorPage = () => {
  const [brand, setBrand] = useState("NISSAN");
  const [model, setModel] = useState("LEAF: 85 KW");
  const [grade, setGrade] = useState("ZAA-ZE1");
  const [year, setYear] = useState("Please Select Model Year");
  const [engineSize, setEngineSize] = useState("Please Select Car CC");

  const modelOptions = useMemo(() => {
    if (!modelsByBrand[brand]) return ["Please Select Model"];
    return ["Please Select Model", ...modelsByBrand[brand]];
  }, [brand]);

  const estimatedDuty = useMemo(() => {
    const base = dutyBaseByCc[engineSize] || 0;
    const selectedYear = Number(year);
    const currentYear = new Date().getFullYear();
    const ageAdjustment = selectedYear ? Math.max(currentYear - selectedYear, 0) * 45000 : 0;
    const hybridDiscount =
      model.toLowerCase().includes("hybrid") ||
      model.toLowerCase().includes("e:hev") ||
      model.toLowerCase().includes("leaf")
        ? 125000
        : 0;

    return Math.max(base - hybridDiscount + ageAdjustment, 0);
  }, [engineSize, model, year]);

  const handleBrandChange = (value: string) => {
    setBrand(value);
    setModel(modelsByBrand[value]?.[0] || "Please Select Model");
  };

  return (
    <main className="bg-white px-4 py-14 md:px-8">
      <section className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-medium tracking-wide text-[#003399]">
          Duty Calculator of Bangladesh
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-wide text-black md:text-5xl">
          CAR DUTY CALCULATOR
        </h1>
        <div className="mx-auto mt-5 h-px w-24 bg-gray-400" />
        <p className="mx-auto mt-8 max-w-4xl text-base leading-7 text-slate-700">
          You can find your desired car import tax of Bangladesh, also known as
          duty, easily on CarClickBD. Select the brand, model, grade, model year,
          and engine size to estimate the import duty before buying.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-[460px] overflow-hidden rounded-sm bg-white shadow-[0_2px_12px_rgba(0,0,0,0.18)]">
        <div className="relative bg-[#003399] px-6 pb-10 pt-6 text-center text-white">
          <h2 className="text-2xl font-bold tracking-wide">CAR DUTY CALCULATOR</h2>
          <div className="absolute inset-x-0 bottom-[-1px] h-10 rounded-b-[50%] bg-white" />
        </div>

        <div className="space-y-5 px-10 pb-10 pt-7">
          <DutySelect
            icon={Car}
            value={brand}
            options={brands}
            onChange={handleBrandChange}
          />
          <DutySelect
            icon={Calculator}
            value={model}
            options={modelOptions}
            onChange={setModel}
          />
          <DutySelect
            icon={ShieldCheck}
            value={grade}
            options={grades}
            onChange={setGrade}
          />
          <DutySelect
            icon={Calendar}
            value={year}
            options={years}
            onChange={setYear}
          />
          <DutySelect
            icon={Gauge}
            value={engineSize}
            options={engineSizes}
            onChange={setEngineSize}
          />

          <div className="rounded-lg border border-[#f0b90b]/40 bg-[#f0b90b]/10 px-4 py-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#003399]">
              Estimated Duty
            </p>
            <p className="mt-1 text-2xl font-black text-[#003399]">
              {estimatedDuty > 0
                ? `BDT ${estimatedDuty.toLocaleString("en-IN")}`
                : "Select year and CC"}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-7 max-w-4xl text-center">
        <p className="text-sm text-slate-900">
          <span className="text-[#003399]">Last Updated on</span>{" "}
          2026-05-13 06:44:47.794567
        </p>
        <p className="mt-8 text-base leading-7 text-slate-700">
          Before finalizing the vehicles, make sure you{" "}
          <Link
            href="/verify-auction-sheet"
            className="font-bold text-slate-950 underline"
          >
            verify your auction sheet
          </Link>
          , to get the genuine report about precise mileage and a thorough
          breakdown of interior and exterior condition.
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-5xl">
        <h3 className="text-center text-2xl font-black text-slate-950">
          Available Car Brands
        </h3>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {brands.slice(1).map((brandName) => (
            <button
              key={brandName}
              onClick={() => handleBrandChange(brandName)}
              className={`rounded-lg border px-4 py-3 text-sm font-bold transition ${
                brand === brandName
                  ? "border-[#003399] bg-[#003399] text-white"
                  : "border-gray-200 bg-white text-slate-800 hover:border-[#f0b90b] hover:bg-[#f0b90b]/10"
              }`}
            >
              {brandName}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};

const DutySelect = ({
  icon: Icon,
  value,
  options,
  onChange,
}: {
  icon: typeof Car;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) => {
  return (
    <label className="relative block">
      <Icon
        size={16}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#003399]"
      />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full appearance-auto border border-gray-300 bg-white pl-12 pr-4 text-sm uppercase text-slate-700 outline-none transition focus:border-[#003399] focus:ring-2 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};

export default DutyCalculatorPage;
