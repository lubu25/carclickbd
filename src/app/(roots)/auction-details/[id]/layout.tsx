import type { Metadata } from "next";
import type { ReactNode } from "react";

type ProductMetadata = {
  _id?: string;
  title?: string;
  maker?: string;
  make?: string;
  model?: string;
  year?: number | string;
  launchingYear?: number | string;
  productionYear?: number | string;
  color?: string;
  exteriorColor?: string;
  mileage?: number | string;
  photos?: { mainPhoto?: string };
};

const siteUrl = "https://carclickbd.com";
const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://carclickbd-backend.jdmcarworld.com/api/v1"
).replace(/\/+$/, "");

const toAbsoluteImageUrl = (value?: string) => {
  if (!value) return `${siteUrl}/assets/shared/car.png`;
  if (/^https?:\/\//i.test(value)) return value;

  try {
    return `${new URL(apiBaseUrl).origin}${value.startsWith("/") ? value : `/${value}`}`;
  } catch {
    return `${siteUrl}/assets/shared/car.png`;
  }
};

const getProduct = async (id: string): Promise<ProductMetadata | null> => {
  try {
    const response = await fetch(`${apiBaseUrl}/product/${encodeURIComponent(id)}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;

    const payload = await response.json();
    return payload?.data || null;
  } catch {
    return null;
  }
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) {
    return {
      title: "Car details | CarClickBD",
      alternates: { canonical: `${siteUrl}/car-details/${params.id}` },
    };
  }

  const title =
    product.title ||
    [
      product.year || product.launchingYear || product.productionYear,
      product.maker || product.make,
      product.model,
    ]
      .filter(Boolean)
      .join(" ") ||
    "Car for sale";
  const description = [
    product.model,
    product.year || product.launchingYear || product.productionYear,
    product.color || product.exteriorColor,
    product.mileage ? `${product.mileage} km` : undefined,
  ]
    .filter(Boolean)
    .join(" · ");
  const canonicalUrl = `${siteUrl}/car-details/${product._id || params.id}`;
  const imageUrl = toAbsoluteImageUrl(product.photos?.mainPhoto);

  return {
    title: `${title} | CarClickBD`,
    description: description || `View ${title} details on CarClickBD.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description: description || `View ${title} details on CarClickBD.`,
      url: canonicalUrl,
      siteName: "CarClickBD",
      type: "website",
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description || `View ${title} details on CarClickBD.`,
      images: [imageUrl],
    },
  };
}

export default function ProductDetailsLayout({ children }: { children: ReactNode }) {
  return children;
}
