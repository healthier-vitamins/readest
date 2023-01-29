const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  createBookModalState: false,
  saveWordModalState: false,
  offCanvasModalState: false,
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
  },
});

export const {
  toggleCreateBookModal,
  toggleSaveWordModal,
  toggleOffCanvasModal,
} = state.actions;
export default state.reducer;
