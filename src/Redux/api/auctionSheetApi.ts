import { baseApi } from "./baseApi";

export const auctionSheetApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAuctionSheetReport: build.query({
      query: (chassis: string) => ({
        url: "/auction-sheet/report",
        method: "GET",
        params: { chassis },
      }),
    }),
    createAuctionSheetOrder: build.mutation({
      query: (data: Record<string, any>) => ({
        url: "/auction-sheet/order",
        method: "POST",
        data,
        timeout: 90000,
      }),
      invalidatesTags: ["order"],
    }),
  }),
});

export const {
  useCreateAuctionSheetOrderMutation,
  useLazyGetAuctionSheetReportQuery,
} = auctionSheetApi;

export default auctionSheetApi;
