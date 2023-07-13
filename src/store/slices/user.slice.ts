import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import { apiLogin, apiUserSignUp, apiVerifyUser } from "../apis/user.api";
const cookies = new Cookies();

type Authentication = {
  isUserLoggedIn: boolean;
  userEmail: string | null;
  // userPageId: any;
};

interface LoginState {
  isLoginLoading: boolean;
  loginError: boolean;
}
interface SignUpState {
  isSignUpLoading: boolean;
  signUpError: boolean;
}
interface VerifyState {
  isVerifyLoading: boolean;
  verifyError: boolean;
}

interface InitialState {
  authentication: Authentication;
  loginState: LoginState;
  signUpState: SignUpState;
  verifyState: VerifyState;
}

const initialState: InitialState = {
  authentication: {
    isUserLoggedIn: false,
    userEmail: null,
  },
  loginState: {
    isLoginLoading: false,
    loginError: false,
  },
  signUpState: {
    isSignUpLoading: false,
    signUpError: false,
  },
  verifyState: {
    isVerifyLoading: false,
    verifyError: false,
  },
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
      state.authentication.isUserLoggedIn = false;
      state.authentication.userEmail = null;
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
    },
    addUserPageId: (_state: InitialState, action: PayloadAction<any>) => {
      const id = action.payload;
      cookies.set("user-id", id, {
        maxAge: 3600,
        sameSite: "lax",
        path: "/",
      });
    },
    setIsLoggedIn: (state: InitialState) => {
      state.authentication.isUserLoggedIn = true;
    },
    setIsLoggedOut: (state: InitialState) => {
      state.authentication.isUserLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(apiLogin.fulfilled, (state, action) => {
      state.loginState.isLoginLoading = false;
      state.loginState.loginError = false;
      console.log("HERE,", action.type);
    });
    builder.addCase(apiLogin.pending, (state, action) => {
      state.loginState.isLoginLoading = true;
    });
    builder.addCase(apiLogin.rejected, (state, action) => {
      state.loginState.isLoginLoading = false;
      state.loginState.loginError = true;
    });
    builder.addCase(apiUserSignUp.fulfilled, (state, action) => {
      state.signUpState.isSignUpLoading = false;
      state.signUpState.signUpError = false;
    });
    builder.addCase(apiUserSignUp.rejected, (state, action) => {
      state.signUpState.isSignUpLoading = false;
      state.signUpState.signUpError = true;
    });
    builder.addCase(apiUserSignUp.pending, (state, action) => {
      state.signUpState.isSignUpLoading = true;
    });
    builder.addCase(apiVerifyUser.fulfilled, (state, action) => {
      state.verifyState.isVerifyLoading = false;
      state.verifyState.verifyError = false;
    });
    builder.addCase(apiVerifyUser.rejected, (state, action) => {
      state.verifyState.isVerifyLoading = false;
      state.verifyState.verifyError = true;
    });
    builder.addCase(apiVerifyUser.pending, (state, action) => {
      state.verifyState.isVerifyLoading = true;
    });
  },
});

export const {
  userLoggedIn,
  userLoggedOut,
  addUserPageId,
  setIsLoggedIn,
  setIsLoggedOut,
} = userSlice.actions;
export default userSlice;
