import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleCreateBookModal } from "./states.slice";

const initialState = {
  listOfBooks: {},
  isLoading: true,
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
  reducers: {},
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

export default books.reducer;
