import { baseApi } from "@/Redux/api/baseApi";
import build from "next/dist/build";

const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      // providesTags: ["users"]
    }),
  }),
});

export const { useGetAllUsersQuery } = productApi;
