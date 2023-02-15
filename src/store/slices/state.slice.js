const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  createBookModalState: false,
  saveWordModalState: false,
  offCanvasModalState: false,
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
  },
});

export const {
  toggleCreateBookModal,
  toggleSaveWordModal,
  toggleOffCanvasModal,
  addToastNotificationArr,
  removeToastNotificationArr,
} = state.actions;
export default state.reducer;
