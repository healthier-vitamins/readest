import { PayloadAction } from "@reduxjs/toolkit";
const { createSlice } = require("@reduxjs/toolkit");

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
  abortController: any;
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
  abortController: null,
};

// redux slice
const stateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    toggleCreateBookModal: (state: any) => {
      state.createBookModalState = !state.createBookModalState;
    },
    toggleSaveWordModal: (state: any) => {
      state.saveWordModalState = !state.saveWordModalState;
    },
    toggleBookSelectionPopoverState: (state: any) => {
      state.bookSelectionPopoverState = !state.bookSelectionPopoverState;
    },
    setBookSelectionPopoverState: (state: any, action: PayloadAction<any>) => {
      if (action.payload) {
        state.bookSelectionPopoverState = true;
      } else {
        state.bookSelectionPopoverState = false;
      }
    },
    addToastNotificationArr: (state: any, action: PayloadAction<any>) => {
      state.toastNotificationArr.push(action.payload);
    },
    removeToastNotificationArr: (state: any) => {
      state.toastNotificationArr.shift();
    },
    setShowPopoverPage: (state: any, action: PayloadAction<any>) => {
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
    toggleShowPopoverState: (state: any) => {
      state.showPopoverState.show = !state.showPopoverState.show;
    },
    setShowPopoverState: (state: any, action: PayloadAction<any>) => {
      if (action.payload) {
        state.showPopoverState.show = true;
      } else {
        state.showPopoverState.show = false;
      }
    },
    setAbortController: (state: any, action: PayloadAction<any>) => {
      state.abortController = action.payload;
    },
    removeAbortController: (state: any) => {
      state.abortController = null;
    },
  },
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
} = stateSlice.actions;
export default stateSlice.reducer;
