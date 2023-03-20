// import ApiError from "class/ApiError";
import axios from "axios";
import { axiosTo } from "./promiseUtil";

async function userSignUp(successFuncs: any, errFuncs: any, payload: any) {
  const [goTrueErr, goTrueRes] = await axiosTo(
    axios.post("api/signUp", payload)
  );
  if (goTrueErr) {
    errFuncs(goTrueErr);
    return;
  }
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

async function login(successFuncs: any, errFuncs: any, payload: any) {
  const [goTrueErr, goTrueRes] = await axiosTo(
    axios.post("api/login", payload)
  );
  if (goTrueErr) {
    errFuncs(goTrueErr);
    return;
  }
  successFuncs(goTrueRes);
  return;
}

export { userSignUp, login };
