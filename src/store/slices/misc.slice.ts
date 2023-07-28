import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { addToastNotificationArr } from "./state.slice";
import { GLOBALVARS } from "../../utils/GLOBALVARS";
import { axiosTo } from "../../utils/promise";
// import { checkAndHandleTimeoutError } from "utils/apis/timeoutHandler";

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
    isLoading: false,
  },
};

// stoic qpi
export const getStoicQuote = createAsyncThunk(
  "getStoicQuote",
  async (_payload: any, thunkApi) => {
    const [err, res] = await axiosTo(
      axios.get("https://stoic-quotes.com/api/quote")
    );
    if (err) {
      if (err.status === 500) {
        thunkApi.dispatch(addToastNotificationArr(GLOBALVARS.ERROR_TIMEOUT));
        return;
      }
      thunkApi.dispatch(addToastNotificationArr("Error getting quote."));
      return;
      // }
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
        (state: InitialState, _action: PayloadAction<any>) => {
          state.stoicQuote.isLoading = true;
        }
      )
      .addCase(
        getStoicQuote.rejected,
        (state: InitialState, _action: PayloadAction<any>) => {
          state.stoicQuote.isLoading = false;
        }
      );
  },
});

// export const {} = miscSlice.actions
export default miscSlice;
