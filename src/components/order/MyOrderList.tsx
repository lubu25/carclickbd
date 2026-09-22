"use client";
import React, { useState, useMemo } from "react";
import OrderTable from "@/components/table/OrderTable";
import { useGetMyOrdersQuery } from "@/Redux/api/orderApi";
import { IOrder } from "@/Interface/order";

const getOrders = (response: any): IOrder[] => {
  if (Array.isArray(response?.orders?.data)) return response.orders.data;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.orders)) return response.orders;
  if (Array.isArray(response)) return response;
  return [];
};

const getTotal = (response: any, fallback: number) =>
  response?.orders?.meta?.total || response?.meta?.total || fallback;

const MyOrderList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: response, isLoading } = useGetMyOrdersQuery({
    page,
    limit: pageSize,
    searchTerm,
  }) as { data: any; isLoading: boolean }; 
  
  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  //Filter customers only
  const orders = useMemo(() => {
    return getOrders(response);
  }, [response]);

  const title = "My Orders";

  return (
    <div className="p-6">
      <OrderTable
        orders={orders}
        loading={isLoading}
        onSearch={handleSearch}
        setSearchTerm={setSearchTerm}
        pagination={{
          current: page,
          pageSize,
          total: getTotal(response, orders.length),
        }}
        title={title}
        onChange={handleTableChange}
        onPaymentInitiated={(orderId: string) => {
          console.log(`Payment initiated for order ID: ${orderId}`);
        }}
      />
    </div>
  );
};

export default MyOrderList;
