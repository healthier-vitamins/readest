import { configureStore } from "@reduxjs/toolkit";
import wordDefinitionReducer from "./actions/wordDefinition";

export const store = configureStore({
  reducer: {
    wordDefinition: wordDefinitionReducer,
  },
});
