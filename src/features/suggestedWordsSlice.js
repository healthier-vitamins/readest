import { createSlice } from "@reduxjs/toolkit";

const suggestedWordsSlice = createSlice({
  name: "suggestedWords",
  initialState: [],
  reducers: {
    addWords: (state, { payload }) => {
      if (typeof payload === "string") {
        state.push(payload);
      }
    },
    resetWords: (state) => {
      while (state.length > 0) {
        state.pop();
      }
    },
  },
});

export const { addWords, resetWords } = suggestedWordsSlice.actions;
export default suggestedWordsSlice.reducer;
