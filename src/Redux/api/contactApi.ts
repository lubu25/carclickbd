
import { baseApi } from "./baseApi";

const CONTACT_URL = "/contact";
export const contactApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    messages: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: `${CONTACT_URL}`,
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response) => {
        return {
          messages: response,
        };
      },
      providesTags: ["message"],
    }),
    
    getMyMessages: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: `${CONTACT_URL}/my-message`,
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response) => {
        return {
          messages: response,
        };
      },
      providesTags: ["message"],
    }),



    // get single order
    contactMessage: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `${CONTACT_URL}/${id}`,
        method: "GET",
      }),
      providesTags: ["message"],
    }),


    // create a new order
    sendMessage: build.mutation({
      query: (data) => ({
        url: `${CONTACT_URL}/create-order`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["message", "notification"],
    }),


    // update order
    updateMessage: build.mutation({
      query: (data) => ({
        url: `${CONTACT_URL}/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: ["message"],
    }),

    // delete order
    deleteMessage: build.mutation({
      query: (id) => ({
        url: `${CONTACT_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["message"],
    }),

  }),
});

export const {
  useSendMessageMutation,
  useDeleteMessageMutation,
  useContactMessageQuery,
  useMessagesQuery,
  useUpdateMessageMutation,
  useGetMyMessagesQuery,
} = contactApi;
