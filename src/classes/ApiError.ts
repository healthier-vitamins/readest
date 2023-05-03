import { addToastNotificationArr } from "store/slices/state.slice";
import store from "store/store";
import { GLOBALVARS } from "utils/GLOBALVARS";

export default class ApiError extends Error {
  private errMsg: string;
  private status: number | string;
  // private isTimeOut: boolean;

  constructor(_errMsg: string, _status: string | number) {
    super(_errMsg);
    this.errMsg = _errMsg;
    this.status = _status;
    // this.isTimeOut = _isTimeOut;

    if (this.errMsg !== "canceled") {
      if (
        this.errMsg.includes("time out") ||
        this.status == 500 ||
        this.status == 502 ||
        this.status === "canceled"
      ) {
        store.dispatch(addToastNotificationArr(GLOBALVARS.ERROR_TIMEOUT));
      } else {
        store.dispatch(addToastNotificationArr(this.errMsg));
      }
    }
  }

  // get errMsg() {
  //   return this._errMsg;
  // }

  // get status() {
  //   return this._status;
  // }
}
