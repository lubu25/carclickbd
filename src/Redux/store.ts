import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import { commentApi } from "./features/comment/commentApi";
import rootReducer from "./rootReducer";
import { watchlistApi } from "./features/watch-list/watchlistApi";
import { bidsApi } from "./features/bids/bidsApi";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    //
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(commentApi.middleware)
      .concat(bidsApi.middleware)
      .concat(watchlistApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
