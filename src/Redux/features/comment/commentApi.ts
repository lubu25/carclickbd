import { IProduct } from "@/Interface/product";
import { baseApi } from "@/Redux/api/baseApi";

export const commentApi: any = baseApi.injectEndpoints({
  endpoints: (build: any) => ({
    createComment: build.mutation({
      query: (data: any) => ({
        url: "/product/comment/",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["comment"],
    }),

    getCommentHistory: build.query({
      query: () => {
        return {
          url: `/product/comment/commenthistoris`,
          method: "GET",
        };
      },
      providesTags: ["comment"],
    }),
    getMyComments: build.query({
      query: () => {
        return {
          url: `/product/comment/my-comments`,
          method: "GET",
        };
      },
      providesTags: ["comment"],
    }),
    getAllProductCommentHistory: build.query({
      query: () => {
        return {
          url: "/product/comment/all",
          method: "GET",
        };
      },
      providesTags: ["comment"],
    }),


    getSpecificProductComment: build.query({
      query: (id: string) => {
        return {
          url: `/product/comment/${id}`,
          method: "GET",
        };
        
      },
      providesTags: ["comment"],
    }),

    UpdateComment: build.mutation({
      query: ({ data, id }: { data: IProduct; id: string }) => ({
        url: `/comment/${id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: ["comment"],
    }),

    getAllCommentsOnProduct: build.query({
      query: (id: string) => ({
        url: `/product/comment/${id}`,
        method: "GET",
      }),
      providesTags: ["comment", "reply"],
    }),

    deleteComment: build.mutation({
      query: (id: string) => ({
        url: `/product/comment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["comment"],
    }),

    toggleLikeDislikeComment: build.mutation({
      query: (commentId: string) => ({
        url: `/product/comment/like/${commentId}`,
        method: "POST",
      }),
      invalidatesTags: ["comment"],
    }),

    addReplyToComment: build.mutation({
      query: ({
        commentId,
        replyText,
      }: {
        commentId: string;
        replyText: string;
      }) => {
        console.log("Reply being sent:", { commentId, replyText }); // Debug log
        return {
          url: `/product/comment/reply/${commentId}`,
          method: "POST",
          data: { reply: replyText },
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["comment", "reply"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useGetAllCommentsOnProductQuery,
  useDeleteCommentMutation,
  useToggleLikeDislikeCommentMutation,
  useAddReplyToCommentMutation,
  useGetCommentHistoryQuery,
  useGetAllProductCommentHistoryQuery,
  useGetMyCommentsQuery,
  useGetSpecificProductCommentQuery,
} = commentApi;
