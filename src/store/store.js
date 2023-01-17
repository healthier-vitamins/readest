import { configureStore } from "@reduxjs/toolkit";
import wordDefinitionReducer from "./slices/wordDefinition.slice";
import statesReducer from "./slices/states.slice";
import booksReducer from "./slices/books.slice";

export const store = configureStore({
  reducer: {
    wordDefinition: wordDefinitionReducer,
    states: statesReducer,
    books: booksReducer,
  },
});
