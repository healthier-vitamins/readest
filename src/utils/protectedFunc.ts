import store from "../store/store";
import {
  addToastNotificationArr,
  setShowPopoverState,
} from "../store/slices/state.slice";

export default function protectedFunction(fn: any) {
  const {
    authentication: { isUserLoggedIn },
  }: any = store.getState().user;
  if (isUserLoggedIn) {
    return fn();
  } else {
    store.dispatch(addToastNotificationArr("Please login."));
    store.dispatch(setShowPopoverState(true));
  }
}
