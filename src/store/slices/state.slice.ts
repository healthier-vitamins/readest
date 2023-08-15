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
  unauthorisedRedirect: boolean;
  bookDoesNotExistRedirect: boolean;
  isPageReloaded: boolean;
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
  unauthorisedRedirect: false,
  bookDoesNotExistRedirect: false,
  isPageReloaded: true,
};

// redux slice
const stateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    resetState: (_state) => {
      return initialState;
    },
    toggleCreateBookModal: (state) => {
      state.createBookModalState = !state.createBookModalState;
    },
    closeCreateBookModal: (state) => {
      state.createBookModalState = false;
    },
    toggleSaveWordModal: (state) => {
      state.saveWordModalState = !state.saveWordModalState;
    },
    toggleBookSelectionPopoverState: (state) => {
      state.bookSelectionPopoverState = !state.bookSelectionPopoverState;
    },
    setBookSelectionPopoverState: (
      state: InitialState,
      action: PayloadAction<boolean>
    ) => {
      if (action.payload) {
        state.bookSelectionPopoverState = true;
      } else {
        state.bookSelectionPopoverState = false;
      }
    },
    addToastNotificationArr: (state, action: PayloadAction<string>) => {
      state.toastNotificationArr.push(action.payload);
    },
    removeToastNotificationArr: (state) => {
      state.toastNotificationArr.shift();
    },
    setShowPopoverPage: (
      state,
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
    toggleShowPopoverState: (state) => {
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
    setUnauthorisedRedirector: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.unauthorisedRedirect = true;
      } else {
        state.unauthorisedRedirect = false;
      }
    },
    setBookDoesNotExistRedirector: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.bookDoesNotExistRedirect = true;
      } else {
        state.bookDoesNotExistRedirect = false;
      }
    },
    setPageReloadedToFalse: (state) => {
      state.isPageReloaded = false;
    },
  },
});

export const {
  toggleCreateBookModal,
  closeCreateBookModal,
  toggleSaveWordModal,
  toggleBookSelectionPopoverState,
  addToastNotificationArr,
  removeToastNotificationArr,
  setShowPopoverPage,
  toggleShowPopoverState,
  setShowPopoverState,
  setBookSelectionPopoverState,
  setUnauthorisedRedirector,
  setPageReloadedToFalse,
  setBookDoesNotExistRedirector,
  resetState,
} = stateSlice.actions;
export default stateSlice;
