import { configureStore } from "@reduxjs/toolkit";
import wordDefinitionReducer from "./actions/wordDefinition.action";

export const store = configureStore({
  reducer: {
    wordDefinition: wordDefinitionReducer,
  },
});
