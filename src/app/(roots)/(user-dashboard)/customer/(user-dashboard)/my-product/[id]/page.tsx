"use client";

import ProductDetails from "@/components/dashboardlayout/ProductDetails";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const productId = Array.isArray(id) ? id[0] : id;

  if (!productId) return <p className="text-center text-lg font-bold mt-10">Invalid product ID</p>;

  return <ProductDetails productId={productId} />;
}