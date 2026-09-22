import { baseApi } from "./baseApi";

export const auctionSheetApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAuctionSheetReport: build.query({
      queryFn: async (chassis: string, _queryApi, _extraOptions, fetchWithBQ) => {
        // Use standard fetch to bypass the baseApi's baseUrl and auth headers
        try {
          const response = await fetch(`https://jpcenter.ru/api/report?chassis=${encodeURIComponent(chassis)}`);
          if (!response.ok) {
            return { error: { status: response.status, data: await response.text() } };
          }
          const data = await response.json();
          return { data };
        } catch (error: any) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
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
