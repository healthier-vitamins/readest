import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleCreateBookModal } from "./states.slice";

const initialState = {
  listOfBooks: {},
  isLoading: true,
  selectedBook: {},
  lastSavedBook: [],
  bookSelection: [
    {
      bookObj: "Definition",
      active: true,
    },
  ],
};

// create book
export const postBook = createAsyncThunk(
  "postBook",
  async (payload, thunkApi) => {
    const resp = await axios.post(`/api/postBook`, payload);
    if (resp.status === 200) {
      thunkApi.dispatch(toggleCreateBookModal());
      thunkApi.dispatch(getBooks());
    }
    return resp.data;
  }
);

// get books
export const getBooks = createAsyncThunk(
  "getBooks",
  async (payload, thunkApi) => {
    const resp = await axios.get(`/api/getBooks`);
    return resp.data;
  }
);

const books = createSlice({
  name: "books",
  initialState,
  reducers: {
    addBookSelection: (state, action) => {
      state.bookSelection.forEach((book) => {
        book.active = false;
      });

      if (
        state.bookSelection.some(
          (book) =>
            JSON.stringify(book.bookObj) === JSON.stringify(action.payload)
        )
      ) {
        const index = state.bookSelection.findIndex(
          (book) =>
            JSON.stringify(book.bookObj) === JSON.stringify(action.payload)
        );
        state.bookSelection[index].active = true;
        state.selectedBook = state.bookSelection[index];
      } else {
        const tempObj = {
          bookObj: action.payload,
          active: true,
        };
        state.bookSelection.push(tempObj);
        state.selectedBook = tempObj;
      }
    },
    changeActiveTab: (state, action) => {
      state.bookSelection.forEach((book) => {
        book.active = false;
      });
      state.bookSelection[action.payload].active = true;
      state.selectedBook = state.bookSelection[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postBook.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(postBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postBook.rejected, (state) => {
        state.isLoading = true;
      })
      .addCase(getBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listOfBooks = action.payload;
      })
      .addCase(getBooks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBooks.rejected, (state) => {
        state.isLoading = true;
      });
  },
});

export const { addBookSelection, changeActiveTab } = books.actions;
export default books.reducer;
