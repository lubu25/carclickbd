import { baseApi } from "@/Redux/api/baseApi";

export const notificationApi: any = baseApi.injectEndpoints({
  endpoints: (build: any) => ({
    getNotifications: build.query({
      query: () => ({
        url: `/notification`,
        method: "GET",
      }),
      // Modify the transformResponse to only return 'data' from the response object
      transformResponse: (response: any) => {
        const data = response?.data;

        if (Array.isArray(data)) {
          return data;
        }

        if (Array.isArray(data?.data)) {
          return data.data;
        }

        return [];
      },
      providesTags: ["notification"],
    }),

    updateNotifications: build.mutation({
      query: (id: string) => ({
        url: `/notification/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["notification"],
    }),

    deleteNotification: build.mutation({
      query: (id: string) => ({
        url: `/notification/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notification"],
    }),

    createProductInquiryNotification: build.mutation({
      query: (data: any) => ({
        url: `/notification/product-inquiry`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["notification"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNotificationsQuery,
  useUpdateNotificationsMutation,
  useDeleteNotificationMutation,
  useCreateProductInquiryNotificationMutation,
} = notificationApi;
