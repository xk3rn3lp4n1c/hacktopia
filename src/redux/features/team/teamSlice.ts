import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface teamState {
  teamName: string;
}

export const initialState: teamState = {
  teamName: "",
};

export const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeam: (state, action: PayloadAction<string>) => {
      state.teamName = action.payload;
    },
    clearTeam: (state) => {
      state.teamName = "";
    },
  },
});

export const { setTeam, clearTeam } = teamSlice.actions;
export default teamSlice.reducer;
