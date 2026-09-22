import { baseApi } from "@/Redux/api/baseApi";
import { TQueryParam } from "@/types/global.type";

export const bidsApi: any = baseApi.injectEndpoints({
  endpoints: (build: any) => ({
    // getAllMyBids: build.query({
    //   query: () => {
    //     return {
    //       url: `/bid/my-bids`,
    //       method: "GET",
    //     };
    //   },
    // }),

    
    getAllMyBids: build.query({
      query: (args: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/bid/my-bids",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["bid"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllMyBidsQuery } = bidsApi;
