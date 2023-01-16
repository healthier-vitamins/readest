const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  createBookModalState: false,
};

const states = createSlice({
  name: "states",
  initialState,
  reducers: {
    toggleCreateBookModal: (state) => {
      state.createBookModalState = !state.createBookModalState;
    },
  },
});

export const { toggleCreateBookModal } = states.actions;
export default states.reducer;
