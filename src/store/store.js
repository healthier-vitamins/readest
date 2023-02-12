import { configureStore } from "@reduxjs/toolkit";
import word from "./slices/word.slice";
import state from "./slices/state.slice";
import book from "./slices/book.slice";
import user from "./slices/user.slice";

export const store = configureStore({
  reducer: {
    word: word,
    state: state,
    book: book,
    user: user,
  },
});
