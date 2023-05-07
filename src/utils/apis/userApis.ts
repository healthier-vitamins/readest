import axios from "axios";
import { axiosTo } from "../promise";
import store from "../../store/store";
import { addUserPageId, userLoggedOut } from "../../store/slices/user.slice";
import { resetBookSelection } from "store/slices/book.slice";
import { NavigateFunction } from "react-router-dom";
import { checkAndHandleTimeoutError } from "./timeoutHandler";

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
    // eslint-disable-next-line
    const [notionErr, notionRes] = await axiosTo(
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

async function login(onSuccess: any, onError: any, payload: any) {
  const originUrl = window.location.origin;

  const [goTrueErr, goTrueRes] = await axiosTo(
    axios.post(`${originUrl}/api/login`, payload)
  );
  if (goTrueErr) {
    if (checkAndHandleTimeoutError(goTrueErr, null)) {
      onError(goTrueErr);
      return;
    }
  }

  const [updateLoggedInErr, updateLoggedInRes] = await axiosTo(
    axios.post(`${originUrl}/api/updateLoggedInDate`, payload)
  );

  if (updateLoggedInErr) {
    if (checkAndHandleTimeoutError(updateLoggedInErr, null)) {
      onError(updateLoggedInErr);
      return;
    }
  }

  store.dispatch(addUserPageId(updateLoggedInRes.id));
  onSuccess(goTrueRes);
  return;
}

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

async function logout(navigate: NavigateFunction) {
  store.dispatch(userLoggedOut());
  store.dispatch(resetBookSelection());
  navigate("/");
}

export { userSignUp, login, verifyUser, logout };
