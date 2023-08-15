import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import { apiLogin, apiUserSignUp, apiVerifyUser } from "../apis/user.api";
const cookies = new Cookies();

type Authentication = {
  isUserLoggedIn: boolean;
  userEmail: string | null;
};

interface InitialState {
  authentication: Authentication;
  isLoginLoading: boolean;
  isSignUpLoading: boolean;
  isVerifyLoading: boolean;
}

const initialState: InitialState = {
  authentication: {
    isUserLoggedIn: false,
    userEmail: null,
  },
  isLoginLoading: false,
  isSignUpLoading: false,
  isVerifyLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoggedIn: (state: InitialState, action: PayloadAction<string>) => {
      const email = action.payload;
      state.authentication.isUserLoggedIn = true;
      state.authentication.userEmail = email;
    },
    userLoggedOut: (state: InitialState) => {
      // state.authentication.isUserLoggedIn = false;
      // state.authentication.userEmail = null;
      cookies.remove("token", {
        sameSite: "lax",
        path: "/",
      });
      cookies.remove("refresh_token", {
        sameSite: "lax",
        path: "/",
      });
      cookies.remove("page-id", {
        sameSite: "lax",
        path: "/",
      });
      cookies.remove("user-id", {
        sameSite: "lax",
        path: "/",
      });
      return initialState;
    },
    // addUserPageId: (_state: InitialState, action: PayloadAction<any>) => {
    //   const id = action.payload;
    //   cookies.set("user-id", id, {
    //     maxAge: 3600,
    //     sameSite: "lax",
    //     path: "/",
    //   });
    // },
    setIsLoggedIn: (state: InitialState) => {
      state.authentication.isUserLoggedIn = true;
    },
    setIsLoggedOut: (state: InitialState) => {
      state.authentication.isUserLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(apiLogin.fulfilled, (state, action) => {
      const id = action.payload?.id;
      cookies.set("user-id", id, {
        maxAge: 3600,
        sameSite: "lax",
        path: "/",
      });
      state.isLoginLoading = false;
    });
    builder.addCase(apiLogin.pending, (state) => {
      state.isLoginLoading = true;
    });
    builder.addCase(apiLogin.rejected, (state) => {
      state.isLoginLoading = false;
    });
    builder.addCase(apiUserSignUp.fulfilled, (state) => {
      state.isSignUpLoading = false;
    });
    builder.addCase(apiUserSignUp.rejected, (state) => {
      state.isSignUpLoading = false;
    });
    builder.addCase(apiUserSignUp.pending, (state) => {
      state.isSignUpLoading = true;
    });
    builder.addCase(apiVerifyUser.fulfilled, (state) => {
      state.isVerifyLoading = false;
    });
    builder.addCase(apiVerifyUser.rejected, (state) => {
      state.isVerifyLoading = false;
    });
    builder.addCase(apiVerifyUser.pending, (state) => {
      state.isVerifyLoading = true;
    });
  },
});

export const { userLoggedIn, userLoggedOut, setIsLoggedIn, setIsLoggedOut } =
  userSlice.actions;
export default userSlice;
