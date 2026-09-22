import { baseApi } from './baseApi';

export const PAYMENT = '/payment';

const paymentApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getPayment: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: `${PAYMENT}/`,
          method: 'GET',
          params: arg,
        };
      },
      transformResponse: response => {
        return {
          myPayments: response,
        };
      },
      providesTags: ['payment'],
    }),

    initBdGatePayment: build.mutation({
      query: (items: any) => ({
        url: `${PAYMENT}/bdgate/init`,
        method: 'POST',
        data: items,
      }),
      invalidatesTags: ['payment'],
    }),

    initBdGateAuctionSheetPayment: build.mutation({
      query: (items: any) => ({
        url: `${PAYMENT}/bdgate/auction-sheet`,
        method: 'POST',
        data: items,
        timeout: 90000,
      }),
      invalidatesTags: ['payment'],
    }),

    syncBdGatePaymentStatus: build.mutation({
      query: (token: string) => ({
        url: `${PAYMENT}/bdgate/status/${token}`,
        method: 'GET',
      }),
      invalidatesTags: ['payment', 'order'],
    }),

    getBdGateAuctionSheetPaymentStatus: build.query({
      query: (paymentId: string) => ({
        url: `${PAYMENT}/bdgate/auction-sheet/status/${paymentId}`,
        method: 'GET',
      }),
      providesTags: ['payment', 'auctionSheet'],
    }),

    createPayment: build.mutation({
      query: (item: any) => ({
        url: `${PAYMENT}/create`,
        method: 'POST',
        data: item,
      }),
      invalidatesTags: ['payment'],
    }),
  }),
});

export const {
  useGetPaymentQuery,
  useInitBdGatePaymentMutation,
  useInitBdGateAuctionSheetPaymentMutation,
  useSyncBdGatePaymentStatusMutation,
  useLazyGetBdGateAuctionSheetPaymentStatusQuery,
  useCreatePaymentMutation,
} = paymentApi;

export default paymentApi;
