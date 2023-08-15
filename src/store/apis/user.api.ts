import { axiosTo } from "../../utils/promise";
import store from "../store";
import { userLoggedIn, userLoggedOut } from "../slices/user.slice";
import { checkAndHandleTimeoutError } from "./timeoutHandler";
import { resetBook } from "../slices/book.slice";
import httpClient from "../../utils/httpclient/HTTPClient";
import {
  addToastNotificationArr,
  resetState,
  setShowPopoverPage,
  setShowPopoverState,
} from "../slices/state.slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { router } from "../../components/router/Router";
import { GLOBALVARS } from "../../utils/GLOBALVARS";
import { getAllBook } from "./book.api";
import { resetMisc } from "../slices/misc.slice";
import { resetWord } from "../slices/word.slice";

type SignUpPayload = {
  email: string;
  password: string;
};

export const apiUserSignUp = createAsyncThunk(
  "apiUserSignUp",
  async (payload: SignUpPayload, thunkApi) => {
    const [goTrueErr, goTrueRes] = await axiosTo(
      httpClient.Post("signUp", payload)
    );
    if (goTrueErr) {
      if (checkAndHandleTimeoutError(goTrueErr, null)) {
        thunkApi.dispatch(addToastNotificationArr(goTrueErr.data));
        return thunkApi.rejectWithValue(goTrueErr.data);
      }
    }

    // search if email exists in db
    const [queryEmailErr, queryEmailRes] = await axiosTo(
      httpClient.Post("queryEmail", payload)
    );

    if (queryEmailErr) {
      if (checkAndHandleTimeoutError(queryEmailErr, null)) {
        thunkApi.dispatch(addToastNotificationArr(queryEmailErr.data));
        return thunkApi.rejectWithValue(queryEmailErr.data);
      }
    }

    // if email exists
    if (queryEmailRes.results.length > 0) {
      thunkApi.dispatch(setShowPopoverPage(GLOBALVARS.POPOVER_LOGIN));
      thunkApi.dispatch(
        addToastNotificationArr(
          `Verification email sent to ${goTrueRes?.email}`
        )
      );
    } else {
      // create new account in notion
      const [notionErr, notionRes] = await axiosTo(
        httpClient.Post("postUser", payload)
      );
      if (notionErr) {
        if (checkAndHandleTimeoutError(notionErr, null)) {
          thunkApi.dispatch(addToastNotificationArr(notionErr.data));
          return thunkApi.rejectWithValue(notionErr.data);
        }
      }
      thunkApi.dispatch(setShowPopoverPage(GLOBALVARS.POPOVER_LOGIN));
      thunkApi.dispatch(
        addToastNotificationArr(
          `Verification email sent to ${goTrueRes?.email}`
        )
      );
      return notionRes;
    }
    return goTrueRes;
  }
);

interface ApiLoginPayload {
  email: string;
  password: string;
}

export const apiLogin = createAsyncThunk(
  "apiLogin",
  async (payload: ApiLoginPayload, thunkApi) => {
    const [err, res] = await axiosTo(httpClient.Post("login", payload));
    if (err) {
      if (checkAndHandleTimeoutError(err, null)) {
        thunkApi.dispatch(addToastNotificationArr(err.data));
      }
      return thunkApi.rejectWithValue(err.data);
    }
    const email = res.email;

    const [updateErr, updateRes] = await axiosTo(
      httpClient.Post("updateLoggedInDate", { email: email })
    );
    if (updateErr) {
      if (checkAndHandleTimeoutError(updateErr, null)) {
        thunkApi.dispatch(addToastNotificationArr(updateErr.data));
      }
      return thunkApi.rejectWithValue(updateErr.data);
    }

    thunkApi.dispatch(userLoggedIn(email));
    thunkApi.dispatch(setShowPopoverState(false));
    thunkApi.dispatch(getAllBook(updateRes.id));
    return updateRes;
  }
);

interface ApiVerifyUserPayload {
  token: string;
}

export const apiVerifyUser = createAsyncThunk(
  "apiVerifyUser",
  async (payload: ApiVerifyUserPayload, thunkApi) => {
    const [err, res] = await axiosTo(httpClient.Post("confirmEmail", payload));
    if (err) {
      if (checkAndHandleTimeoutError(err, null)) {
        if (String(err.data).includes("User not found")) {
          thunkApi.dispatch(
            addToastNotificationArr(`${err.data}, perhaps email is in use`)
          );
          return thunkApi.rejectWithValue(err.data);
        } else {
          thunkApi.dispatch(addToastNotificationArr(err.data));
        }
        thunkApi.dispatch(setShowPopoverState(false));
        router.navigate(`/`, { replace: true });
        return thunkApi.rejectWithValue(err.data);
      }
    }
    router.navigate(`/`, { replace: true });
    return res;
  }
);

function logout() {
  store.dispatch(userLoggedOut());
  store.dispatch(resetBook);
  store.dispatch(resetMisc);
  store.dispatch(resetState);
  store.dispatch(resetWord);
  router.navigate("/");
}

export { logout };
