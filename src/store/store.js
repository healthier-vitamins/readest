import { configureStore } from "@reduxjs/toolkit";
import wordsDefinitionReducer from "../features/suggestedWordsSlice";

export const store = configureStore({
  reducer: {
    wordsDefinition: wordsDefinitionReducer,
  },
});
