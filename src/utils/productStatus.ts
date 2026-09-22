import { IProduct, ProductListingStatus } from "@/Interface/product";

export const productStatuses: ProductListingStatus[] = [
  "pending",
  "upcoming",
  "approval",
  "reserve",
  "under_negotiations",
  "sold",
];

export const productStatusMeta: Record<
  ProductListingStatus,
  {
    label: string;
    tagColor: string;
    badgeClass: string;
    badgeStyle: {
      backgroundColor: string;
      borderColor: string;
      color: string;
    };
  }
> = {
  pending: {
    label: "Pending",
    tagColor: "gold",
    badgeClass: "ring-amber-300",
    badgeStyle: {
      backgroundColor: "#f59e0b",
      borderColor: "#fbbf24",
      color: "#ffffff",
    },
  },
  upcoming: {
    label: "Upcoming",
    tagColor: "purple",
    badgeClass: "ring-violet-300",
    badgeStyle: {
      backgroundColor: "#7c3aed",
      borderColor: "#a78bfa",
      color: "#ffffff",
    },
  },
  approval: {
    label: "Available",
    tagColor: "green",
    badgeClass: "ring-emerald-300",
    badgeStyle: {
      backgroundColor: "#059669",
      borderColor: "#34d399",
      color: "#ffffff",
    },
  },
  reserve: {
    label: "Reserve",
    tagColor: "orange",
    badgeClass: "ring-orange-300",
    badgeStyle: {
      backgroundColor: "#ea580c",
      borderColor: "#fb923c",
      color: "#ffffff",
    },
  },
  under_negotiations: {
    label: "Under Negotiation",
    tagColor: "blue",
    badgeClass: "ring-sky-300",
    badgeStyle: {
      backgroundColor: "#0284c7",
      borderColor: "#38bdf8",
      color: "#ffffff",
    },
  },
  sold: {
    label: "Sold",
    tagColor: "red",
    badgeClass: "ring-red-300",
    badgeStyle: {
      backgroundColor: "#dc2626",
      borderColor: "#f87171",
      color: "#ffffff",
    },
  },
};

export const normalizeProductStatus = (
  product?: Partial<IProduct>
): ProductListingStatus => {
  const rawStatus = String(product?.status || "").trim().toLowerCase();
  const normalizedStatus =
    rawStatus === "under negotiations" || rawStatus === "under negotiation"
      ? "under_negotiations"
      : rawStatus;

  if (productStatuses.includes(normalizedStatus as ProductListingStatus)) {
    return normalizedStatus as ProductListingStatus;
  }
  if (product?.isDraft) return "pending";
  if (product?.isSoldOut) return "reserve";
  return "approval";
};

export const getProductStatusMeta = (product?: Partial<IProduct>) =>
  productStatusMeta[normalizeProductStatus(product)];
