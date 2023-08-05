import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface User {
  name: string;
  email: string;
  uid: string | null;
}

const initialState: User = {
  name: "User",
  email: "",
  uid: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state = initialState;
    },
    login: (state, action: PayloadAction<User>) => {
      state = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = userSlice.actions;

export default userSlice;
