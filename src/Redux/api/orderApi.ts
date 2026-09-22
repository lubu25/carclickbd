
import { baseApi } from "./baseApi";

const ORDER_URL = "/orders";
export const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    orders: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: `${ORDER_URL}`,
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response) => {
        return {
          orders: response,
        };
      },
      providesTags: ["order"],
    }),
    
    getMyOrders: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: `${ORDER_URL}/my-order`,
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response) => {
        return {
          orders: response,
        };
      },
      providesTags: ["order"],
    }),



    // get single order
    order: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `/${ORDER_URL}/${id}`,
        method: "GET",
      }),
      providesTags: ["order"],
    }),


    // create a new order
    createOrder: build.mutation({
      query: (data) => ({
        url: `/${ORDER_URL}/create-order`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["order"],
    }),


    // update order
    updateOrder: build.mutation({
      query: (data) => ({
        url: `/${ORDER_URL}/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: ["order"],
    }),

    // delete order
    deleteOrder: build.mutation({
      query: (id) => ({
        url: `/${ORDER_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["order"],
    }),

  }),
});

export const {
  useCreateOrderMutation,
  useDeleteOrderMutation,
  useOrderQuery,
  useOrdersQuery,
  useUpdateOrderMutation,
  useGetMyOrdersQuery
} = orderApi;
