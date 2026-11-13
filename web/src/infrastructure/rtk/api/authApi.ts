import { baseApi } from "./baseApi";
import {
  AuthResponseDto,
  ForgotPasswordRequestDto,
  LoginRequestDto,
  RegisterRequestDto,
  ResendVerificationRequestDto,
  ResetPasswordRequestDto,
  UserResponseDto,
  VerifyEmailRequestDto,
} from "../../../application/dto/auth.dto";
import { ApiResponse } from "../../http/http-client";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<AuthResponseDto>, LoginRequestDto>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    register: builder.mutation<ApiResponse<AuthResponseDto>, RegisterRequestDto>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    getMe: builder.query<ApiResponse<UserResponseDto>, void>({
      query: () => "/auth/me",
      providesTags: ["Auth", "User"],
    }),

    logout: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    verifyEmail: builder.mutation<
      ApiResponse<{ isEmailVerified: boolean }>,
      VerifyEmailRequestDto
    >({
      query: (body) => ({
        url: "/auth/verify-email",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    resendVerification: builder.mutation<ApiResponse<void>, ResendVerificationRequestDto>({
      query: (body) => ({
        url: "/auth/resend-verification",
        method: "POST",
        body,
      }),
    }),

    forgotPassword: builder.mutation<ApiResponse<void>, ForgotPasswordRequestDto>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<ApiResponse<void>, ResetPasswordRequestDto>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useLogoutMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
