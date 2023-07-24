import { axiosTo } from "../../utils/promise";
import store from "../store";
import { userLoggedIn, userLoggedOut } from "../slices/user.slice";
import { checkAndHandleTimeoutError } from "./timeoutHandler";
import { resetBookSelection } from "../slices/book.slice";
import httpClient from "../../utils/httpclient/HTTPClient";
import {
  addToastNotificationArr,
  setShowPopoverPage,
  setShowPopoverState,
} from "../slices/state.slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { router } from "../../components/router/Router";
import { GLOBALVARS } from "../../utils/GLOBALVARS";
import { getAllBook } from "./book.api";

export const apiUserSignUp = createAsyncThunk(
  "apiUserSignUp",
  async (payload: any, thunkApi) => {
    const [goTrueErr, goTrueRes] = await axiosTo(
      httpClient.Post("signUp", payload)
    );
    if (goTrueErr) {
      if (checkAndHandleTimeoutError(goTrueErr, null)) {
        thunkApi.dispatch(addToastNotificationArr(goTrueErr.data));
        return;
      }
    }

    // search if email exists in db
    const [queryEmailErr, queryEmailRes] = await axiosTo(
      httpClient.Post("queryEmail", payload)
    );

    if (queryEmailErr) {
      if (checkAndHandleTimeoutError(queryEmailErr, null)) {
        thunkApi.dispatch(addToastNotificationArr(queryEmailErr.data));
        return;
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
      const [notionErr, _notionRes] = await axiosTo(
        httpClient.Post("postUser", payload)
      );
      if (notionErr) {
        if (checkAndHandleTimeoutError(notionErr, null)) {
          thunkApi.dispatch(addToastNotificationArr(notionErr.data));
          return;
        }
      }
      thunkApi.dispatch(setShowPopoverPage(GLOBALVARS.POPOVER_LOGIN));
      thunkApi.dispatch(
        addToastNotificationArr(
          `Verification email sent to ${goTrueRes?.email}`
        )
      );
      return;
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
      return;
    }
    const email = res.email;

    const [updateErr, updateRes] = await axiosTo(
      httpClient.Post("updateLoggedInDate", { email: email })
    );
    if (updateErr) {
      if (checkAndHandleTimeoutError(updateErr, null)) {
        thunkApi.dispatch(addToastNotificationArr(updateErr.data));
      }
      return;
    }

    thunkApi.dispatch(userLoggedIn(email));
    thunkApi.dispatch(setShowPopoverState(false));
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
        } else {
          thunkApi.dispatch(addToastNotificationArr(err.data));
        }
        thunkApi.dispatch(setShowPopoverState(false));
        router.navigate(`/`, { replace: true });
        return;
      }
    }
    router.navigate(`/`, { replace: true });
    return res;
  }
);

function logout() {
  store.dispatch(userLoggedOut());
  store.dispatch(resetBookSelection());
  router.navigate("/");
}

export { logout };
