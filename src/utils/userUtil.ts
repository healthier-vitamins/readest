// @ts-ignore
import { store } from "../store/store";
import {
  addToastNotificationArr,
  setShowPopoverState,
  // @ts-ignore
} from "../store/slices/state.slice.js";

const userSchema: UserSchema = {
  TITLE: "Name",
  STATUS: "STATUS",
  NAME: "NAME",
  EMAIL: "EMAIL",
  IS_DELETED: "IS_DELETED",
  CREATED_TIME: "CREATED_TIME",
  LAST_EDITED_TIME: "LAST_EDITED_TIME",
};

interface UserSchema {
  TITLE: string;
  STATUS: string;
  NAME: string;
  EMAIL: string;
  IS_DELETED: string;
  CREATED_TIME: string;
  LAST_EDITED_TIME: string;
}

function protectedFunction(fn: any) {
  const logged = store.getState().user.authentication.isUserLoggedIn;
  if (logged) {
    return fn();
  } else {
    store.dispatch(addToastNotificationArr("Please login."));
    store.dispatch(setShowPopoverState(true));
  }
}

export { userSchema, UserSchema, protectedFunction };
