import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import snackSlice from "./slices/snackSlice";
import reloadSlice from "./slices/reloadSlice";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    snackbar: snackSlice.reducer,
    reload: reloadSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
