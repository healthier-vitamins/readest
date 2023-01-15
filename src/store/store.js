import { configureStore } from "@reduxjs/toolkit";
import wordDefinitionReducer from "./actions/wordDefinition.action";
import statesReducer from "./actions/states.action";

export const store = configureStore({
  reducer: {
    wordDefinition: wordDefinitionReducer,
    states: statesReducer,
  },
});
