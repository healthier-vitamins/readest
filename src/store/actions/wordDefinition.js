import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// api url with query passed through as parameter
function apiUrl(queryPayload) {
  return `https://dictionaryapi.com/api/v3/references/sd4/json/${queryPayload}?key=${process.env.REACT_APP_DICTIONARY_KEY}`;
}

// action initialstate
const initialState = {
  suggestedWord: [],
  chosenWordDefinition: "",
  isLoading: true,
};

// function to hold fetch
export const getWordDefinition = createAsyncThunk(
  "getWordDefinition",
  async (queryPayload, thunkApi) => {
    const resp = await axios.get(apiUrl(queryPayload));
    console.log(resp);
    return resp.data;
  }
);

// function isRejectedAction(action) {
//   return action.type.endsWith("rejected");
// }

// redux slice
const wordDefinition = createSlice({
  name: "wordDefinition",
  initialState,
  reducers: {
    resetSuggestedWord: (state) => {
      while (state.suggestedWord.length > 1) {
        state.suggestedWord.pop();
      }
    },
  },

  // to trigger api call
  // extraReducers: {
  //   [getWordDefinition.pending]: (state) => {
  //     state.isLoading = true;
  //   },
  //   [getWordDefinition.fulfilled]: (state, action) => {
  //     state.isLoading = false;
  //     state.suggestedWord.push(action.payload);
  //   },
  //   [getWordDefinition.rejected]: (state, action) => {
  //     state.isLoading = false;
  //   },
  // },
  extraReducers: (builder) => {
    builder
      .addCase(getWordDefinition.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.length > 0 && action.payload !== "Word is required.") {
          state.suggestedWord = action.payload;
        } else {
          state.suggestedWord = [];
        }
      })
      .addCase(getWordDefinition.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWordDefinition.rejected, (state) => {
        state.isLoading = true;
      });
  },
});

export const { resetSuggestedWord } = wordDefinition.actions;
export default wordDefinition.reducer;
