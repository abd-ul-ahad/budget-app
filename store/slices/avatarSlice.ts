import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Avatar {
  path: any;
}

const initialState: Avatar = {
  path: require("../../assets/avatars/10.png"),
};

export const avatarSlice = createSlice({
  name: "avatar",
  initialState,
  reducers: {
    setAvatar: (state, action: PayloadAction<Avatar>) => {
      state.path = action.payload.path;
    },
  },
});

export const { setAvatar } = avatarSlice.actions;

export default avatarSlice;
