import { PayloadAction } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
const { createSlice } = require("@reduxjs/toolkit");
const cookies = new Cookies();

type Authentication = {
  isUserLoggedIn: boolean;
  userEmail: string | null;
  // userPageId: any;
};

interface InitialState {
  // isSignUpLoading: true,
  // isConfirmEmailLoading: true,
  authentication: Authentication;
}

const initialState: InitialState = {
  // isSignUpLoading: true,
  // isConfirmEmailLoading: true,
  authentication: {
    isUserLoggedIn: false,
    userEmail: null,
    // userPageId: null,
  },
};

// export const signUp = createAsyncThunk("signUp", async (payload, thunkApi) => {
//   const resp = await axios.post("api/signUp", payload);
//   return resp.data;
// });

// export const confirmEmail = createAsyncThunk(
//   "confirmEmail",
//   async (payload, thunkApi) => {
//     const resp = await axios.post("api/confirmEmail", payload);
//     console.log("res ??????????????? ", resp);
//     return resp.data;
//   }
// );

// export const login = createAsyncThunk("login", async (payload, thunkApi) => {
//   const [err, res] = await axiosTo(axios.post("api/login", payload));
//   if (err) console.error(err.response);
//   console.log(res);
//   return res.data;
// });

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoggedIn: (state: InitialState, action: PayloadAction<any>) => {
      const { token, refreshToken, email } = action.payload;
      cookies.set("token", token, {
        maxAge: 3600,
        sameSite: "lax",
        path: "/",
      });
      cookies.set("refresh_token", refreshToken, {
        maxAge: 3600,
        sameSite: "lax",
        path: "/",
      });
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
    addUserPageId: (state: InitialState, action: PayloadAction<any>) => {
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
