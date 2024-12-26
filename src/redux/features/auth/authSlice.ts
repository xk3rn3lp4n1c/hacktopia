import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface authenticationState {
  token: string;
  email: string;
  userName: string;
}

export const initialState: authenticationState = {
  token: "",
  email: "",
  userName: "",
};

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    authenticate: (
      state,
      action: PayloadAction<{ token: string; email: string; userName: string }>
    ) => {
      const { token, email, userName } = action.payload;
      state.token = token;
      state.email = email;
      state.userName = userName;
    },
    logout: (state) => {
      state.token = "";
      state.email = "";
      state.userName = "";
    },
  },
});

export const { authenticate, logout } = authenticationSlice.actions;
export default authenticationSlice.reducer;
