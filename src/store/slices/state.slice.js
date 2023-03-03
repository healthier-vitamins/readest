const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  createBookModalState: false,
  saveWordModalState: false,
  offCanvasModalState: false,
  showPopoverState: {
    show: false,
    state: {
      signUpState: false,
      loginState: true,
      emailConfirmState: false,
    },
  },
  toastNotificationArr: [],
};

// redux slice
const state = createSlice({
  name: "state",
  initialState,
  reducers: {
    toggleCreateBookModal: (state) => {
      state.createBookModalState = !state.createBookModalState;
    },
    toggleSaveWordModal: (state) => {
      state.saveWordModalState = !state.saveWordModalState;
    },
    toggleOffCanvasModal: (state) => {
      state.offCanvasModalState = !state.offCanvasModalState;
    },
    addToastNotificationArr: (state, action) => {
      state.toastNotificationArr.push(action.payload);
    },
    removeToastNotificationArr: (state) => {
      state.toastNotificationArr.shift();
    },
    setShowPopoverPage: (state, action) => {
      const keys = Object.keys(state.showPopoverState.state);
      const hold = {};
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
    setShowPopoverState: (state, action) => {
      if (action.payload) {
        state.showPopoverState.show = true;
      } else {
        state.showPopoverState.show = false;
      }
    },
  },
});

export const {
  toggleCreateBookModal,
  toggleSaveWordModal,
  toggleOffCanvasModal,
  addToastNotificationArr,
  removeToastNotificationArr,
  setShowPopoverPage,
  toggleShowPopoverState,
  setShowPopoverState,
} = state.actions;
export default state.reducer;
