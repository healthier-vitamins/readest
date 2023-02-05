const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  createBookModalState: false,
  saveWordModalState: false,
  offCanvasModalState: false,
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
  },
});

export const {
  toggleCreateBookModal,
  toggleSaveWordModal,
  toggleOffCanvasModal,
  addSavingWordToast,
  removeSavingWordToast,
} = state.actions;
export default state.reducer;
