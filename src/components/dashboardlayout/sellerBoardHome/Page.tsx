"use client";

import Link from "next/link";
import {
  ArrowRightOutlined,
  BarChartOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  DollarOutlined,
  EyeOutlined,
  PlusOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Spin } from "antd";
import { IProduct } from "@/Interface/product";
import { useGetMyProductQuery } from "@/Redux/api/productApi";
import { useAppSelector } from "@/Redux/hooks";

const toNumber = (value: unknown) => {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
};

const formatBDT = (value: number) =>
  value ? `BDT ${value.toLocaleString("en-US")}` : "BDT 0";

const getStatus = (product: IProduct) =>
  String(product.status || (product.isDraft ? "pending" : "approval")).toLowerCase();

const hasChassisNumber = (product: IProduct) => {
  const item = product as any;
  return Boolean(item.vinChassisNumber || item.vin || item.chassisNumber);
};

const SellerBoardHome = () => {
  const profile = useAppSelector((state) => state.authReducer.profile);
  const displayName = profile?.name || profile?.email || "Seller";
  const { data, isLoading } = useGetMyProductQuery([]);
  const products: IProduct[] = data?.data || [];

  const activeListings = products.filter((product) => {
    const status = getStatus(product);
    return !product.isDraft && !["sold", "reserve"].includes(status);
  }).length;
  const buyerInquiries = products.reduce(
    (total, product) =>
      total + toNumber(product.totalComment || (product.comments as any)?.length),
    0,
  );
  const profileViews = products.reduce(
    (total, product) => total + toNumber(product.views),
    0,
  );
  const salesValue = products
    .filter((product) => getStatus(product) === "sold")
    .reduce(
      (total, product) =>
        total +
        toNumber(product.mainPrice || product.highestBid || product.minBid),
      0,
    );
  const fullPhotoListings = products.filter(
    (product) => product.photos?.mainPhoto && product.photos?.others?.length,
  ).length;
  const fullPhotoPercent = products.length
    ? Math.round((fullPhotoListings / products.length) * 100)
    : 0;
  const missingChassis = products.filter((product) => !hasChassisNumber(product)).length;
  const reservedVehicles = products.filter(
    (product) => getStatus(product) === "reserve",
  ).length;
  const pendingListings = products.filter(
    (product) => product.isDraft || getStatus(product) === "pending",
  ).length;
  const stats = [
    {
      title: "Active Listings",
      value: String(activeListings),
      note: `${pendingListings} pending approval`,
      icon: CarOutlined,
      tone: "bg-blue-50 text-blue-700 ring-blue-100",
    },
    {
      title: "Buyer Inquiries",
      value: String(buyerInquiries),
      note: `${buyerInquiries} total inquiries`,
      icon: CommentOutlined,
      tone: "bg-amber-50 text-amber-700 ring-amber-100",
    },
    {
      title: "Profile Views",
      value: String(profileViews),
      note: "total listing views",
      icon: EyeOutlined,
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
    {
      title: "Sales Value",
      value: formatBDT(salesValue),
      note: "sold listings only",
      icon: DollarOutlined,
      tone: "bg-slate-100 text-slate-800 ring-slate-200",
    },
  ];

  const listingHealth = [
    ["Listings with full photos", `${fullPhotoPercent}%`, `${fullPhotoListings} of ${products.length}`],
    ["Listings missing chassis", String(missingChassis), missingChassis ? "Fix" : "Good"],
    ["Reserved vehicles", String(reservedVehicles), "Watch"],
    ["Pending approval", String(pendingListings), pendingListings ? "Review" : "Good"],
  ];

  const recentListings = [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    )
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="grid min-h-[360px] place-items-center rounded-lg bg-white">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg bg-gradient-to-r from-slate-950 via-[#08245d] to-[#003399] text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
        <div className="relative p-6 md:p-8">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="relative">
            <div className="max-w-4xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#f0b90b]">
                <CheckCircleOutlined />
                Verified Seller Workspace
              </div>
              <h1 className="max-w-3xl text-3xl font-black leading-tight md:text-4xl">
                Welcome back, {displayName}. Manage your real listings from one
                premium seller panel.
              </h1>
              <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-slate-200 md:text-base">
                Your dashboard uses live seller data. Missing data is shown as 0.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/seller/my-product/create-product"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#e50914] px-5 text-sm font-black text-white transition hover:bg-[#b80f17]"
                >
                  Create Listing <PlusOutlined />
                </Link>
                <Link
                  href="/seller/my-product"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/25 bg-white/10 px-5 text-sm font-bold text-white transition hover:bg-white hover:text-slate-950"
                >
                  View My Listings <ArrowRightOutlined />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-md ring-1 ${item.tone}`}
              >
                <Icon />
              </div>
              <p className="text-sm font-bold text-slate-500">{item.title}</p>
              <p className="mt-1 text-2xl font-black text-slate-950">
                {item.value}
              </p>
              <p className="mt-2 text-xs font-semibold text-emerald-600">
                {item.note}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950">
                Quick Seller Actions
              </h2>
              <p className="text-sm text-slate-500">
                Common actions for managing your real inventory.
              </p>
            </div>
            <BarChartOutlined className="text-xl text-slate-400" />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {[
              {
                title: "Add a new car",
                desc: "Create a vehicle listing with photos, specs, price, and location.",
                href: "/seller/my-product/create-product",
                icon: PlusOutlined,
              },
              {
                title: "View listings",
                desc: "Review your active, pending, reserved, and sold listings.",
                href: "/seller/my-product",
                icon: CarOutlined,
              },
              {
                title: "Request featured",
                desc: "Request featured placement for premium vehicles.",
                href: "/seller/featured-requests",
                icon: StarOutlined,
              },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-lg"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-slate-950 text-white transition group-hover:bg-sky-600">
                    <Icon />
                  </div>
                  <h3 className="font-black text-slate-950">{action.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {action.desc}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-sky-700">
                    Open <ArrowRightOutlined />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-950">
              Listing Health
            </h2>
            <CheckCircleOutlined className="text-xl text-slate-400" />
          </div>
          <div className="space-y-3">
            {listingHealth.map(([label, value, status]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-bold text-slate-800">{label}</p>
                  <p className="text-xs font-medium text-slate-500">{status}</p>
                </div>
                <p className="text-lg font-black text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-950">Recent Listings</h2>
            <p className="text-sm text-slate-500">
              Latest vehicles from your seller account.
            </p>
          </div>
          <ClockCircleOutlined className="text-xl text-slate-400" />
        </div>
        {recentListings.length ? (
          <div className="grid gap-3 md:grid-cols-3">
            {recentListings.map((product) => (
              <div
                key={product._id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <p className="font-black text-slate-950">
                  {product.title || [product.make, product.model].filter(Boolean).join(" ") || "Untitled listing"}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-600">
                  {getStatus(product)}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-sky-700 ring-1 ring-sky-100">
                    {product.productionYear || product.launchingYear || "Year N/A"}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {formatBDT(toNumber(product.mainPrice || product.highestBid || product.minBid))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-lg font-black text-slate-950">0 recent listings</p>
            <p className="mt-2 text-sm text-slate-500">
              Create your first listing to see real dashboard activity here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default SellerBoardHome;
