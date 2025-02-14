import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { USERS_URL } from "../constants";

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: USERS_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token; // Extract token from Redux state
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Users"], // Define tag types for caching
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/auth",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    register: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/profile/password",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getUsers: builder.query({
      query: () => "/",
      providesTags: ["Users"],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    getUserDetails: builder.query({
      query: (userId) => `/${userId}`,
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),

    updateUser: builder.mutation({
      query: ({ userId, ...data }) => ({
        url: `/${userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
      ],
    }),

    getUserReviewedProducts: builder.query({
      query: () => "/user/reviewed-products",
      providesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useGetUserReviewedProductsQuery,
} = userApiSlice;

export default userApiSlice;
