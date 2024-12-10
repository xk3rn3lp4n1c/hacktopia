import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface authenticationState {
  token: string;
  email: string;
  userName: string;
  userId: string;
}

export const initialState: authenticationState = {
  token: "",
  email: "",
  userName: "",
  userId: "",
};

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    authenticate: (
      state,
      action: PayloadAction<{ token: string; email: string; userName: string; userId: string }>
    ) => {
      const { token, email, userName, userId } = action.payload;
      state.token = token;
      state.email = email;
      state.userName = userName;
      state.userId = userId;
    },
    logout: (state) => {
      state.token = "";
      state.email = "";
      state.userName = "";
      state.userId = "";
    },
  },
});

export const { authenticate, logout } = authenticationSlice.actions;
export default authenticationSlice.reducer;
