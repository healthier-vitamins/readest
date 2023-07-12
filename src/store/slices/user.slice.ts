import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
const cookies = new Cookies();

type Authentication = {
  isUserLoggedIn: boolean;
  userEmail: string | null;
  // userPageId: any;
};

interface InitialState {
  authentication: Authentication;
}

const initialState: InitialState = {
  authentication: {
    isUserLoggedIn: false,
    userEmail: null,
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
  // extraReducers: (builder) => {
  //   builder
  // .addCase(signUp.fulfilled, (state, action) => {
  //   state.isSignUpLoading = false;
  // })
  // .addCase(signUp.pending, (state) => {
  //   state.isSignUpLoading = true;
  // })
  // .addCase(signUp.rejected, (state) => {
  //   state.isSignUpLoading = true;
  // })
  // .addCase(confirmEmail.fulfilled, (state) => {
  //   state.isConfirmEmailLoading = false;
  // })
  // .addCase(confirmEmail.pending, (state) => {
  //   state.isConfirmEmailLoading = true;
  // })
  // .addCase(confirmEmail.rejected, (state, action) => {
  //   state.isConfirmEmailLoading = true;
  //   console.log("rejected ??????????????? ", action);
  // });
  // },
});
export const {
  userLoggedIn,
  userLoggedOut,
  addUserPageId,
  setIsLoggedIn,
  setIsLoggedOut,
} = userSlice.actions;
export default userSlice;
