/* eslint-disable @typescript-eslint/no-misused-promises */
import axios from "axios";
import { axiosTo } from "../../utils/promise";
import store, { AppThunk } from "../store";
import {
  addUserPageId,
  userLoggedIn,
  userLoggedOut,
} from "../slices/user.slice";
import { NavigateFunction } from "react-router-dom";
import { checkAndHandleTimeoutError } from "./timeoutHandler";
import { resetBookSelection } from "../slices/book.slice";
import httpClient from "../../utils/httpclient/HTTPClient";
import {
  addToastNotificationArr,
  setShowPopoverState,
} from "../slices/state.slice";

async function userSignUp(onSuccess: any, onError: any, payload: any) {
  const [goTrueErr, goTrueRes] = await axiosTo(
    axios.post("api/signUp", payload)
  );
  if (goTrueErr) {
    if (checkAndHandleTimeoutError(goTrueErr, null)) {
      onError(goTrueErr);
      return;
    }
  }

  // search if email exists in db
  const [queryEmailErr, queryEmailRes] = await axiosTo(
    axios.post("api/queryEmail", payload)
  );

  if (queryEmailErr) {
    if (checkAndHandleTimeoutError(queryEmailErr, null)) {
      onError(queryEmailErr);
      return;
    }
  }

  // if email exists
  if (queryEmailRes.results.length > 0) {
    onSuccess(goTrueRes);
    return;
  } else {
    // create new account in notion
    const [notionErr, _notionRes] = await axiosTo(
      axios.post("api/postUser", payload)
    );
    if (notionErr) {
      if (checkAndHandleTimeoutError(notionErr, null)) {
        onError(notionErr);
        return;
      }
    }
    onSuccess(goTrueRes);
    return;
  }
}

function login(payload: any): AppThunk {
  return function (dispatch, getState) {
    httpClient.Post("login", payload)?.then(
      (res) => {
        const email = res.data.email;
        dispatch(userLoggedIn(email));
        dispatch(setShowPopoverState(false));
      },
      (err) => {
        if (checkAndHandleTimeoutError(err, null)) {
          dispatch(addToastNotificationArr(err.data));
        }
      }
    );
  };
}

// async function loginOld(onSuccess: any, onError: any, payload: any) {
//   const originUrl = window.location.origin;

//   const [goTrueErr, goTrueRes] = await axiosTo(
//     axios.post(`${originUrl}/api/login`, payload)
//   );
//   if (goTrueErr) {
//     if (checkAndHandleTimeoutError(goTrueErr, null)) {
//       onError(goTrueErr);
//       return;
//     }
//   }

//   const [updateLoggedInErr, updateLoggedInRes] = await axiosTo(
//     axios.post(`${originUrl}/api/updateLoggedInDate`, payload)
//   );

//   if (updateLoggedInErr) {
//     if (checkAndHandleTimeoutError(updateLoggedInErr, null)) {
//       onError(updateLoggedInErr);
//       return;
//     }
//   }

//   store.dispatch(addUserPageId(updateLoggedInRes.id));
//   onSuccess(goTrueRes);
//   return;
// }

async function verifyUser(onSuccess: any, onError: any, payload: any) {
  // eslint-disable-next-line
  const [err, res] = await axiosTo(axios.post("api/confirmEmail", payload));

  if (err) {
    if (checkAndHandleTimeoutError(err, null)) {
      onError(err);
      return;
    }
  }
  onSuccess(res);
  return;
}

function logout(navigate: NavigateFunction) {
  store.dispatch(userLoggedOut());
  store.dispatch(resetBookSelection());
  navigate("/");
}

export { userSignUp, login, verifyUser, logout };
