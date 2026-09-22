import { baseApi } from "@/Redux/api/baseApi";

const url = "/auth/admin/register";

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createAdmin: build.mutation<any, any>({
      query: (data) => ({
        url: url,
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["user"],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateAdminMutation } = userApi;
