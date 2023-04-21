import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosTo } from "utils/promise";
import { addToastNotificationArr } from "./state.slice";

export interface StoicQuote {
  quote: string | null;
  author: string | null;
  isLoading: boolean;
}

interface InitialState {
  stoicQuote: StoicQuote;
}

const initialState: InitialState = {
  stoicQuote: {
    quote: null,
    author: null,
    isLoading: true,
  },
};

// stoic qpi
export const getStoicQuote = createAsyncThunk(
  "getStoicQuote",
  async (payload: any, thunkApi) => {
    const [err, res] = await axiosTo(
      axios.get("https://stoic-quotes.com/api/quote")
    );
    if (err) {
      thunkApi.dispatch(addToastNotificationArr("Error getting quote."));
      console.log(err.message);
      return;
    }
    return res;
  }
);

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getStoicQuote.fulfilled,
        (state: InitialState, action: PayloadAction<any>) => {
          state.stoicQuote.isLoading = false;
          const { text, author } = action.payload;
          state.stoicQuote.author = author;
          state.stoicQuote.quote = text;
        }
      )
      .addCase(
        getStoicQuote.pending,
        (state: InitialState, action: PayloadAction<any>) => {
          state.stoicQuote.isLoading = true;
        }
      )
      .addCase(
        getStoicQuote.rejected,
        (state: InitialState, action: PayloadAction<any>) => {
          state.stoicQuote.isLoading = true;
        }
      );
  },
});

// export const {} = miscSlice.actions
export default miscSlice.reducer;
