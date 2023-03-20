// @ts-ignore
import { store } from "../store/store";
import {
  addToastNotificationArr,
  setShowPopoverState,
  // @ts-ignore
} from "../store/slices/state.slice.js";

export default function protectedFunction(fn: any) {
  const logged = store.getState().user.authentication.isUserLoggedIn;
  if (logged) {
    return fn();
  } else {
    store.dispatch(addToastNotificationArr("Please login"));
    store.dispatch(setShowPopoverState(true));
  }
}
