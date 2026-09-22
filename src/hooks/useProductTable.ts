"use client";
import { useGetAllProductQuery } from "@/Redux/api/productApi";
import { useEffect, useState, useMemo } from "react";
import { IProduct } from "@/Interface/product";

type TQueryParam = {
  name: string;
  value: boolean;
};

const useProductTable = (extraParams: TQueryParam[] = []) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [localMediaMap, setLocalMediaMap] = useState<Record<string, any>>({});

  const { data: response, isLoading } = useGetAllProductQuery([
    { name: "page", value: currentPage },
    { name: "limit", value: pageSize },
    ...extraParams,
  ]);

  // Fetch local product media as a fallback
  useEffect(() => {
    fetch("/api/local-products")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          const mediaMap: Record<string, any> = {};
          data.forEach((p: any) => {
            const id = p._id || p.id;
            if (id) {
              mediaMap[id] = p;
            }
          });
          setLocalMediaMap(mediaMap);
        }
      })
      .catch((err) => console.error("Failed to load local products", err));
  }, []);

  const rawProducts: IProduct[] = response?.data || [];

  // Merge the backend products with the local media fallbacks
  const products = useMemo(() => {
    return rawProducts.map((product) => {
      const localMedia = localMediaMap[product._id];
      if (localMedia) {
        return {
          ...product,
          photos: {
            ...product.photos,
            mainPhoto: localMedia.photos?.mainPhoto || product.photos?.mainPhoto,
            others: localMedia.photos?.others && localMedia.photos.others.length > 0
              ? localMedia.photos.others
              : product.photos?.others,
          },
        };
      }
      return product;
    });
  }, [rawProducts, localMediaMap]);

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return {
    products,
    isLoading,
    pagination: {
      current: currentPage,
      pageSize,
      total: response?.total || 0,
    },
    handleTableChange,
  };
};

export default useProductTable;