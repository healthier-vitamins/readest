import { GLOBALVARS } from "../../utils/GLOBALVARS";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type PopoverStatePayloadAction =
  | typeof GLOBALVARS.POPOVER_LOGIN
  | typeof GLOBALVARS.POPOVER_SIGNUP
  | typeof GLOBALVARS.POPOVER_CONFIRM_EMAIL;

type ShowPopoverState = {
  signUpState: boolean;
  loginState: boolean;
  emailConfirmState: boolean;
};

interface InitialState {
  createBookModalState: boolean;
  saveWordModalState: boolean;
  bookSelectionPopoverState: boolean;
  showPopoverState: {
    show: boolean;
    state: ShowPopoverState;
  };
  toastNotificationArr: any[];
  redirector: boolean;
}

const initialState: InitialState = {
  createBookModalState: false,
  saveWordModalState: false,
  bookSelectionPopoverState: false,
  showPopoverState: {
    show: false,
    state: {
      signUpState: false,
      loginState: true,
      emailConfirmState: false,
    },
  },
  toastNotificationArr: [],
  redirector: false,
};

// redux slice
const stateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    toggleCreateBookModal: (state: InitialState) => {
      state.createBookModalState = !state.createBookModalState;
    },
    toggleSaveWordModal: (state: InitialState) => {
      state.saveWordModalState = !state.saveWordModalState;
    },
    toggleBookSelectionPopoverState: (state: InitialState) => {
      state.bookSelectionPopoverState = !state.bookSelectionPopoverState;
    },
    setBookSelectionPopoverState: (
      state: InitialState,
      action: PayloadAction<any>
    ) => {
      if (action.payload) {
        state.bookSelectionPopoverState = true;
      } else {
        state.bookSelectionPopoverState = false;
      }
    },
    addToastNotificationArr: (
      state: InitialState,
      action: PayloadAction<any>
    ) => {
      state.toastNotificationArr.push(action.payload);
    },
    removeToastNotificationArr: (state: InitialState) => {
      state.toastNotificationArr.shift();
    },
    setShowPopoverPage: (
      state: any,
      action: PayloadAction<PopoverStatePayloadAction>
    ) => {
      const keys = Object.keys(state.showPopoverState.state);
      const hold: any = {};
      for (let key of keys) {
        if (key === action.payload) {
          hold[key] = true;
        } else {
          hold[key] = false;
        }
      }
      state.showPopoverState.state = hold;
    },
    toggleShowPopoverState: (state: InitialState) => {
      state.showPopoverState.show = !state.showPopoverState.show;
    },
    setShowPopoverState: (
      state: InitialState,
      action: PayloadAction<boolean>
    ) => {
      if (action.payload) {
        state.showPopoverState.show = true;
      } else {
        state.showPopoverState.show = false;
      }
    },
    setRedirector: (state: InitialState, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.redirector = true;
      } else {
        state.redirector = false;
      }
    },
  },
  // extraReducers: (builder) => {
  //   builder.
  // },
});

export const {
  toggleCreateBookModal,
  toggleSaveWordModal,
  toggleBookSelectionPopoverState,
  addToastNotificationArr,
  removeToastNotificationArr,
  setShowPopoverPage,
  toggleShowPopoverState,
  setShowPopoverState,
  setBookSelectionPopoverState,
  setRedirector,
} = stateSlice.actions;
export default stateSlice;
