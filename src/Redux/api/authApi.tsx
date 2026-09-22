import {
  IChangeEmail,
  IChangePassword,
  IForgotPassword,
  ISigninData,
  ISignUpData,
} from "@/Interface/auth";
import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    signup: build.mutation({
      query: (signupdata: ISignUpData) => ({
        url: "/auth/customer/register",
        method: "POST",
        data: signupdata,
      }),
    }),
    signupSeller: build.mutation({
      query: (signupdata: ISignUpData) => ({
        url: "/auth/seller/register",
        method: "POST",
        data: signupdata,
      }),
    }),
    signin: build.mutation({
      query: (signinData: ISigninData) => ({
        url: "/auth/login",
        method: "POST",
        data: signinData,
      }),
    }),
    impersonateUser: build.mutation({
      query: (userId: string) => ({
        url: `/auth/impersonate/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["profile", "auth"],
    }),
    isUserExist: build.mutation({
      query: (data) => ({
        url: "/auth/is-exist",
        method: "POST",
        data: data,
      }),
    }),
    forgotPassword: build.mutation({
      query: (email: IForgotPassword) => ({
        url: "/auth/forget-password",
        method: "POST",
        data: email,
      }),
    }),
    resetPassword: build.mutation({
      query: ({ data }) => ({
        url: `/auth/reset-password`,
        method: "PATCH",
        data: data,
      }),
    }),
    changePassword: build.mutation({
      query: (data: IChangePassword) => ({
        url: `/auth/change-password`,
        method: "PATCH",
        data: data,
      }),
    }),
    changeEmail: build.mutation({
      query: (data: IChangeEmail) => ({
        url: `/auth/change-email`,
        method: "PATCH",
        data: data,
      }),
    }),
    sendVerifictionEmail: build.mutation({
      query: (data: { name: string; email: string }) => ({
        url: "/auth/send-verification-email",
        method: "POST",
        data: data,
      }),
    }),
    verifyEmail: build.mutation({
      query: (token: string) => ({
        url: `/auth/verify-email/${token}`,
        method: "PATCH",
        invalidatesTags: ["profile"],
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useSigninMutation,
  useImpersonateUserMutation,
  useSignupMutation,
  useIsUserExistMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useChangePasswordMutation,
  useChangeEmailMutation,
  useSendVerifictionEmailMutation,
  useSignupSellerMutation
} = authApi;
