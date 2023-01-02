import { configureStore } from "@reduxjs/toolkit";
import suggestedWordsReducer from "../features/suggestedWordsSlice";

export const store = configureStore({
  reducer: {
    suggestedWords: suggestedWordsReducer,
  },
});
