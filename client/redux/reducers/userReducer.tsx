import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  user: any;
  isLogin: boolean;
  isLoading: boolean
}

const initialState: UserState = {
  user: null,
  isLogin: false,
  isLoading: false
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
      state.isLogin = true;
    },
    removeUser: (state) => {
      state.user = null;
      state.isLogin = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    }
  },
});

// Action creators are generated for each case reducer function
export const { addUser, removeUser, setLoading } = userSlice.actions;

export default userSlice.reducer