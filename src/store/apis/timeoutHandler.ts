import { addToastNotificationArr } from "../slices/state.slice";
import store from "../store";
import { GLOBALVARS } from "../../utils/GLOBALVARS";

function checkAndHandleTimeoutError(err: any, thunkApi: any) {
  if (!err?.status) return true;
  if (
    String(err?.response?.data).toLowerCase().includes("timeout") ||
    String(err?.data).toLowerCase().includes("timeout") ||
    String(err?.message).toLowerCase().includes("timeout") ||
    String(err?.message).toLowerCase().includes("timed out")
  ) {
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
