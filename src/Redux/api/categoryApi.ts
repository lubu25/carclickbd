import { baseApi } from "./baseApi";

const url = "/category";

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

// Define category API
const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Create category
    createCategory: build.mutation<any, any>({
      query: (data) => ({
        url: "/category/create-category",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["category"],
    }),
    createSubCategory: build.mutation<any, any>({
      query: (values) => ({
        url: "/category/create-subcategory",
        method: "POST",
        data: values,
      }),
      invalidatesTags: ["category"],
    }),

    updateCategory: build.mutation<any, any>({
      query: (data) => ({
        url: `/category/${data.id}`,
        method: "PATCH",
        body: data, // Use 'body' instead of 'data'
      }),
      invalidatesTags: ["category"],
    }),
   
   
    getAllCategories: build.query<any, {
        shortBy?: string;
        sortOrder?: string;
        searchTerm?: string;
        page?: number;
        limit?: number;
      }>({
      query: ({
        shortBy = "updatedAt",
        sortOrder = "asc",
        searchTerm = "",
        page = 1,
        limit = 10,
      }) => {
        const queryParams = buildQueryParams({
          shortBy,
          sortOrder,
          searchTerm,
          page,
          limit,
        });
        return {
          url: `${url}?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["category"],
    }),

    // Get category by ID
    getCategoryById: build.query<any, string>({
      query: (id) => ({
        url: `${url}/${id}`,
        method: "GET",
      }),
      providesTags: ["category"],
    }),

    // Delete category
    deleteCategory: build.mutation<any, string>({
      query: (id) => ({
        url: `${url}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),

    // Create subcategory
    createSubcategory: build.mutation<any, any>({
      query: (data) => ({
        url: `${url}/create-subcategory`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["category"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useCreateSubcategoryMutation,
  useCreateSubCategoryMutation
} = categoryApi;