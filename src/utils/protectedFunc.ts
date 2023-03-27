// @ts-ignore
import store from "../store/store";
import {
  addToastNotificationArr,
  setShowPopoverState,
  // @ts-ignore
} from "../store/slices/state.slice";

export default function protectedFunction(fn: any) {
  // TODO to come back to this :/
  // @ts-ignore
  const logged = store.getState().user.authentication.isUserLoggedIn;
  if (logged) {
    return fn();
  } else {
    store.dispatch(addToastNotificationArr("Please login"));
    store.dispatch(setShowPopoverState(true));
  }
}
