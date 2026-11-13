import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AppUrls } from "../../constants/app-urls";
import { HttpClient } from "../../http/http-client";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: AppUrls.baseUrl,
    prepareHeaders: (headers) => {
      const token = HttpClient.getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Auth", "User", "Room", "Chat", "Notification", "Friend"],
  endpoints: () => ({}),
});

