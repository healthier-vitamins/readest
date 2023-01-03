import { createSlice } from "@reduxjs/toolkit";

const wordDefinition = createSlice({
  name: "wordDefinition",
  initialState: [],
  reducers: {
    addWord: (state, { payload }) => {
      if (typeof payload === "string") {
        state.push(payload);
      }
    },
    resetWord: (state) => {
      while (state.length > 0) {
        state.pop();
      }
    },
  }
});

export const { addWords, resetWords } = wordDefinition.actions;
export default wordDefinition.reducer;
