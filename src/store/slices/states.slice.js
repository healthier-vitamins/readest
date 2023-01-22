const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  createBookModalState: false,
  saveWordModalState: false,
};

// redux slice
const states = createSlice({
  name: "states",
  initialState,
  reducers: {
    toggleCreateBookModal: (state) => {
      state.createBookModalState = !state.createBookModalState;
    },
    toggleSaveWordModal: (state) => {
      state.saveWordModalState = !state.saveWordModalState;
    },
  },
});

export const { toggleCreateBookModal, toggleSaveWordModal } = states.actions;
export default states.reducer;
