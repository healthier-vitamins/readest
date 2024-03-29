import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import word from "./slices/word.slice";
import state from "./slices/state.slice";
import book from "./slices/book.slice";
import user from "./slices/user.slice";
import misc from "./slices/misc.slice";
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from "redux-persist";
// import storage from "redux-persist/lib/storage";

// const persistConfig = {
//   key: "root",
//   version: 1,
//   storage,
// };

// const rootReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    word: word.reducer,
    book: book.reducer,
    state: state.reducer,
    user: user.reducer,
    misc: misc.reducer,
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
