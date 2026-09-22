

import { axiosBaseQuery } from "@/helpers/axios/axiosBaseQuery";
import { getBaseUrl } from "@/helpers/config/envConfig";
import { createApi } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: getBaseUrl() }),
  endpoints: (builder) => ({}),
  tagTypes: [
    "user",
    "profile",
    "product",
    "auth",
    "comment",
    "reply",
    "watchlist",
    "category",
    "bid",
    "notification",
    "payment",
    "order",
    "cart",
    "event",
    "message",
    "chat",
    "auctionSheet",
  ],
});
