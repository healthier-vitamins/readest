/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { addToastNotificationArr } from "../../store/slices/state.slice";
import store from "../../store/store";
import { GLOBALVARS } from "../GLOBALVARS";

/* eslint-disable eqeqeq */
function checkAndHandleTimeoutError(err: any, thunkApi: any) {
  if (!err?.status) return true;
  if (err.status == 500) {
    if (thunkApi) {
      thunkApi.dispatch(addToastNotificationArr(GLOBALVARS.ERROR_TIMEOUT));
    } else {
      store.dispatch(addToastNotificationArr(GLOBALVARS.ERROR_TIMEOUT));
    }
    return false;
  }
  return true;
}

export { checkAndHandleTimeoutError };
