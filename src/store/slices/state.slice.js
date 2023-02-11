const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  createBookModalState: false,
  saveWordModalState: false,
  offCanvasModalState: false,
  signUpPopoverState: false,
  savingWordToast: [],
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
    addSavingWordToast: (state, action) => {
      state.savingWordToast.push(action.payload);
    },
    removeSavingWordToast: (state) => {
      state.savingWordToast.shift();
    },
    toggleSignUpPopoverState: (state) => {
      console.log(state.signUpPopoverState);
      state.signUpPopoverState = !state.signUpPopoverState;
    },
  },
});

export const {
  toggleCreateBookModal,
  toggleSaveWordModal,
  toggleOffCanvasModal,
  addSavingWordToast,
  removeSavingWordToast,
  toggleSignUpPopoverState,
} = state.actions;
export default state.reducer;
