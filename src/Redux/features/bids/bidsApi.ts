import { baseApi } from "@/Redux/api/baseApi";

export const bidsApi: any = baseApi.injectEndpoints({
  endpoints: (build: any) => ({
    makeBid: build.mutation({
      query: (data: { product: string; bidAmount: string }) => ({
        url: `/bid`,
        method: "POST",
        data: data,
      }),
      //   invalidatesTags: ["bids"]
    }),
    getSpecificProductBids: build.query({
      query: (id: string) => {
        return {
          url: `/bid/${id}`,
          method: "GET",
        };
        
      },
      providesTags: ["bid"],
    }),
    getAllProductBids: build.query({
      query: (id: string) => {
        return {
          url: `/bid/all`,
          method: "GET",
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useMakeBidMutation,
  useGetAllProductBidsQuery,
  useGetSpecificProductBidsQuery,
} = bidsApi;
