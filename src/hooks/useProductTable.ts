"use client";
import { useGetAllProductQuery, useGetMyProductQuery } from "@/Redux/api/productApi";
import { useState, useEffect, useMemo } from "react";
import { IProduct } from "@/Interface/product";

type TQueryParam = {
  name: string;
  value: boolean;
};

const useProductTable = (extraParams: TQueryParam[] = []) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: response, isLoading } = useGetAllProductQuery([
    { name: "page", value: currentPage },
    { name: "limit", value: pageSize },
    ...extraParams,
  ]);

  const [localMediaMap, setLocalMediaMap] = useState<Record<string, any>>({});

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

  const products = useMemo(() => {
    return rawProducts.map((product: any) => {
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