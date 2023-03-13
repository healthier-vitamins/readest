// import ApiError from "class/ApiError";
import axios from "axios";
import { axiosTo } from "./promiseUtil";

async function userSignUp(successFuncs: any, errFuncs: any, payload: any) {
  const [err, res] = await axiosTo(axios.post("api/signUp", payload));
  if (err) {
    errFuncs(err);
    return;
  }
  successFuncs(res);
  return;
}

async function login(successFuncs: any, errFuncs: any, payload: any) {
  const [err, res] = await axiosTo(axios.post("api/login", payload));
  if (err) {
    errFuncs(err);
    return;
  }
  successFuncs(res);
  return;
}

export { userSignUp, login };
