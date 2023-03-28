// import ApiError from "class/ApiError";
import axios from "axios";
import { axiosTo } from "../promise";
// @ts-ignore
import store from "../../store/store";
// @ts-ignore
import { addUserPageId } from "../../store/slices/user.slice";

async function userSignUp(successFuncs: any, errFuncs: any, payload: any) {
  const [goTrueErr, goTrueRes] = await axiosTo(
    axios.post("api/signUp", payload)
  );
  if (goTrueErr) {
    errFuncs(goTrueErr);
    return;
  }

  // search if email exists in db
  const [queryEmailErr, queryEmailRes] = await axiosTo(
    axios.post("api/queryEmail", payload)
  );

  if (queryEmailErr) {
    errFuncs(queryEmailErr);
    return;
  }

  // if email exists
  if (queryEmailRes.results.length > 0) {
    successFuncs(goTrueRes);
    return;
  } else {
    // create new account in notion
    // eslint-disable-next-line
    const [notionErr, notionRes] = await axiosTo(
      axios.post("api/postUser", payload)
    );
    if (notionErr) {
      errFuncs(notionErr);
      return;
    }
    successFuncs(goTrueRes);
    return;
  }
}

async function login(successFuncs: any, errFuncs: any, payload: any) {
  const [goTrueErr, goTrueRes] = await axiosTo(
    axios.post("api/login", payload)
  );
  if (goTrueErr) {
    errFuncs(goTrueErr);
    return;
  }

  // eslint-disable-next-line
  const [updateLoggedInErr, updateLoggedInRes] = await axiosTo(
    axios.post("api/updateLoggedInDate", payload)
  );

  if (updateLoggedInErr) {
    errFuncs(updateLoggedInErr);
    return;
  }

  store.dispatch(addUserPageId(updateLoggedInRes.id));

  successFuncs(goTrueRes);
  return;
}

async function verifyUser(successFuncs: any, errFuncs: any, payload: any) {
  // eslint-disable-next-line
  const [err, res] = await axiosTo(axios.post("api/confirmEmail", payload));

  if (err) {
    errFuncs(err);
    return;
  }
  successFuncs(res);
  return;
}

export { userSignUp, login, verifyUser };
