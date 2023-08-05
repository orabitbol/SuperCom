import { createSlice, createSelector } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    userDetails: {
      username: "",
      password: "",
      role: "",
    },
    isAuth: false,
  },
  reducers: {
    logIn: (state, action) => {
      state.userDetails = action.payload;
      state.isAuth = true;
    },
    logOut: (state) => {
      state.userDetails = {};
      state.isAuth = false;
    },
  },
});

export const { logIn, logOut } = loginSlice.actions;
export default loginSlice.reducer;

const userLogin = (state) => state.login.isAuth;

export const autoSelector = createSelector([userLogin], (userLogin) => {
  return userLogin;
});
