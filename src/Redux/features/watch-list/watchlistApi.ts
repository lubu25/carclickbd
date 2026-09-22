import { baseApi } from "@/Redux/api/baseApi";
import { TQueryParam } from "@/types/global.type";

export const watchlistApi: any = baseApi.injectEndpoints({
  endpoints: (build: any) => ({
    addToWatchList: build.mutation({
      query: (data: { product: string }) => ({
        url: `/product/watchlist`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["watchlist"],
    }),
    getUserWatchList: build.query({
      query: (args: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `/product/watchlist`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["watchlist"],
    }),
  }),
  overrideExisting: false,
});

export const { useAddToWatchListMutation, useGetUserWatchListQuery } =
  watchlistApi;
