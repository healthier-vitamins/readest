/**
 * @deprecated
 */
export default class ApiError {
  private errMsg: string | null;
  private status: number | string | null;
  private prevErrMsg: string | null;
  // private isTimeOut: boolean;

  constructor() {
    this.prevErrMsg = null;
    this.errMsg = null;
    this.status = null;
  }

  public dispatchErrorNotification(
    _errMsg: string,
    _status: string | number | null
  ) {
    this.errMsg = _errMsg;
    this.status = _status;

    console.log("prev err: ", this.prevErrMsg);
    console.log("err: ", this.errMsg);
    console.log("status: ", this.status);
    // if (this.prevErrMsg !== this.errMsg) {
    //   if (this.errMsg !== "canceled") {
    //     this.prevErrMsg = this.errMsg;
    //     if (
    //       this.errMsg.includes("timed out") ||
    //       this.status === "canceled" ||
    //       this.errMsg.includes("timedout")
    //     ) {
    //       store.dispatch(addToastNotificationArr(GLOBALVARS.ERROR_TIMEOUT));
    //     } else if (this.errMsg.includes("path failed validation")) {
    //       store.dispatch(addToastNotificationArr(GLOBALVARS.ERROR_INVALID_URL));
    //     } else {
    //       store.dispatch(addToastNotificationArr(this.errMsg));
    //     }
    //   }
    // }
  }

  // get errMsg() {
  //   return this._errMsg;
  // }

  // get status() {
  //   return this._status;
  // }
}
