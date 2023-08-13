import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import snackSlice from "./slices/snackSlice";
import reloadSlice from "./slices/reloadSlice";
import balanceSlice from "./slices/balanceSlice";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    snackbar: snackSlice.reducer,
    reload: reloadSlice.reducer,
    balances: balanceSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
