
import { baseApi } from "./baseApi";

const EVENT_URL = "/events";

export const eventApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    events: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: EVENT_URL,
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response) => {
        return {
          events: response,
        };
      },
      providesTags: ["event"],
    }),

    event: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `${EVENT_URL}/${id}`,
        method: "GET",
      }),
      providesTags: ["event"],
    }),


    // create a new event
    createEvent: build.mutation({
      query: (data) => ({
        url: `${EVENT_URL}/create-event`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["event"],
    }),

    // update existing event
    updateevent: build.mutation({
      query: (data) => ({
        url: `${EVENT_URL}/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: ["event"],
    }),
    // delete existing event
    deleteeventy: build.mutation({
      query: (id) => ({
        url: `${EVENT_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["event"],
    }),
  }),
});

export const {
  useCreateEventMutation,
  useDeleteeventyMutation,
  useEventQuery,
  useEventsQuery,
  useUpdateeventMutation
} = eventApi;
