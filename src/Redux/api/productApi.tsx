import { IProduct } from "@/Interface/product";
import { baseApi } from "./baseApi";
import { TQueryParam } from "@/types/global.type";

const url = "/product";

const productApi: any = baseApi.injectEndpoints({
  endpoints: (build: any) => ({
    createProduct: build.mutation({
      query: (data: any) => ({
        url: url,
        method: "POST",
        data: data,
        contentType: "multipart/form-data",
      }),
      invalidatesTags: ["product"],
    }),

    getAllProduct: build.query({
      query: (args: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: url,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["product"],
    }),
    
    
    searchResult: build.query({
      query: (args: TQueryParam[]) => {
          const params = new URLSearchParams();
          if (args) {
              args.forEach((item: TQueryParam) => {
                  params.append(item.name, item.value as string);
              });
          }
          return {
              url: `${url}/search-result`,
              method: "GET",
              params: params,
          };
      },
      providesTags: ["product"],
  }),
  



    getMyProduct: build.query({
      query: (args: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/product/my-product",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["product"],
    }),

    // getAllProduct: build.query({
    //   query: (args: TQueryParam[]) => {
    //     const params = new URLSearchParams();
    //     if (args) {
    //       args.forEach((item: TQueryParam) => {
    //         params.append(item.name, item.value as string);
    //       });
    //     }
    //     return {
    //       url: `/product/all-product`,
    //       method: "GET",
    //       params: params,
    //     };
    //   },
    //   providesTags: ["product"],
    // }),

    getProductById: build.query({
      query: (id: string) => ({
        url: `/product/${id}`,
        method: "GET",
      }),
      providesTags: ["product"],
    }),

    toggleProducrtStatus: build.mutation({
      query: ({ id }: any) => ({
        url: `/product/toggle-status/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["product"],
    }),

    updateProductStatus: build.mutation({
      query: ({ id, status }: { id: string; status: string }) => ({
        url: `/product/status/${id}`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["product"],
    }),

    toggleProductFeatured: build.mutation({
      query: ({ id }: any) => ({
        url: `/product/toggle-featured/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["product"],
    }),

    deleteProduct: build.mutation({
      query: (id: string) => ({
        url: `${url}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),
    updateProduct: build.mutation({
      query: ({ data, id }: { data: IProduct | FormData; id: string }) => ({
        url: `${url}/${id}`,
        method: "PATCH",
        data: data,
        contentType: data instanceof FormData ? "multipart/form-data" : undefined,
      }),
      invalidatesTags: ["product"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateProductMutation,
  useGetAllProductQuery,
  useGetMyProductQuery,
  useGetProductByIdQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useUpdateProductStatusMutation,
  useToggleProductFeaturedMutation,
  useToggleProducrtStatusMutation,
  useSearchResultQuery,
} = productApi;
