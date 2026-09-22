import { baseApi } from "./baseApi";
import { IUser } from "@/Interface/user";

const url = "/user";

const buildQueryParams = (params: Record<string, any>): string => {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) =>
      Array.isArray(value)
        ? value
            .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
            .join("&")
        : `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
};

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createUser: build.mutation<any, any>({
      query: (data) => ({
        url: url,
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["user"],
    }),
    createSeller: build.mutation<any, any>({
      query: (data) => ({
        url: "/auth/seller/register",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["user"],
    }),

    updateUser: build.mutation({
      query: (data) => ({
        url: `${url}`,
        method: "PATCH",
        data: data,
        contentType: "multipart/form-data",
      }),
      invalidatesTags: ["user", "profile"],
    }),

    toggleUserStatus: build.mutation<IUser, { id: string }>({
      query: ({  id }) => ({
        url: `/user/toggle-status/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["user"],
    }),
    
    
    basicMembership: build.mutation<IUser, { id: string }>({
      query: (id) => ({
        url: `/user/basic/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["user"],
    }),

    convertToSeller: build.mutation<any, void>({
      query: () => ({
        url: `/user/convert-to-seller`,
        method: "PATCH",
      }),
      invalidatesTags: ["user", "profile"],
    }),

    getAllUser: build.query<any, {isDisabled?: boolean ;shortBy?: string; sortOrder?: string; searchTerm?: string; page?: number;limit?: number;role?: string | string[];}>({
      query: ({
        shortBy = "updatedAt",
        sortOrder = "asc",
        searchTerm = "",
        page = 1,
        limit = 10,
        isDisabled,
        role,
      }) => {
        const queryParams = buildQueryParams({
          shortBy,
          sortOrder,
          searchTerm,
          page,
          limit,
          role,
          isDisabled
        });
        return {
          url: `${url}?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["user"],
    }),
 
    getAllAdmin: build.query<any, {shortBy?: string; sortOrder?: string; searchTerm?: string; page?: number;limit?: number;role?: string | string[];}>({
      query: ({
        shortBy = "updatedAt",
        sortOrder = "asc",
        searchTerm = "",
        page = 1,
        limit = 10,
        role,
      }) => {
        const queryParams = buildQueryParams({
          shortBy,
          sortOrder,
          searchTerm,
          page,
          limit,
          role,
        });
        return {
          url:`/user/admin?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["user"],
    }),
    getAllSeller: build.query<any, {shortBy?: string; sortOrder?: string; searchTerm?: string; page?: number;limit?: number;role?: string | string[];}>({
      query: ({
        shortBy = "updatedAt",
        sortOrder = "asc",
        searchTerm = "",
        page = 1,
        limit = 10,
        role,
      }) => {
        const queryParams = buildQueryParams({
          shortBy,
          sortOrder,
          searchTerm,
          page,
          limit,
          role,
        });
        return {
          url:`/user/seller?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["user"],
    }),
    getAllCustomer: build.query<any, {shortBy?: string; sortOrder?: string; searchTerm?: string; page?: number;limit?: number;role?: string | string[];}>({
      query: ({
        shortBy = "updatedAt",
        sortOrder = "asc",
        searchTerm = "",
        page = 1,
        limit = 10,
        role,
      }) => {
        const queryParams = buildQueryParams({
          shortBy,
          sortOrder,
          searchTerm,
          page,
          limit,
          role,
        });
        return {
          url:`/user/customer?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["user"],
    }),
 
    getUserById: build.query<any, string>({
      query: (id) => ({
        url: `${url}/${id}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
 

    deleteUser: build.mutation<any, string>({
      query: (id) => ({
        url: `${url}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateUserMutation,
  useGetAllUserQuery,
  useDeleteUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useToggleUserStatusMutation,
  useGetAllAdminQuery,
  useGetAllCustomerQuery,
  useGetAllSellerQuery,
  useBasicMembershipMutation,
  useCreateSellerMutation,
  useConvertToSellerMutation
} = userApi;
