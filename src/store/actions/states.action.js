const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  offCanvasState: false,
};

const states = createSlice({
  name: "states",
  initialState,
  reducers: {
    toggleOffCanvas: (state) => {
      state.offCanvasState = !state.offCanvasState;
    },
  },
});

export const { toggleOffCanvas } = states.actions;
export default states.reducer;
