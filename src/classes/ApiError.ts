export default class ApiError {
  private _errMsg: string;
  private _status: number;

  constructor(errMsg: string, status: number) {
    this._errMsg = errMsg;
    this._status = status;
  }

  get errMsg() {
    return this._errMsg;
  }

  get status() {
    return this._status;
  }
}
