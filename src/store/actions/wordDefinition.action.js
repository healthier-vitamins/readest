import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// api url with query passed through as parameter
function apiUrl(queriedWord) {
  return `https://dictionaryapi.com/api/v3/references/sd4/json/${queriedWord}?key=${process.env.REACT_APP_DICTIONARY_KEY}`;
  // return `https://dictionaryapi.com/api/v3/references/ithesaurus/json/${queriedWord}?key=${process.env.REACT_APP_DICTIONARY_KEY}`;
}

// action initialstate
const initialState = {
  suggestedWord: [],
  isWordChosen: false,
  chosenWordDefinition: {
    title: "",
    senses: [],
    abbreviation: "",
    shortDef: "",
  },
  isLoading: true,
};

// exported api call
export const getWordDefinition = createAsyncThunk(
  "getWordDefinition",
  async (queriedWord, thunkApi) => {
    const resp = await axios.get(apiUrl(queriedWord));
    console.log("fetched data ", resp.data);
    return resp.data;
  }
);

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
    addChosenWordDefinition: (state, action) => {
      state.isWordChosen = true;
      console.log(action.payload);
      console.log(action.payload.def[0].sseq[0][0][1].dt);
      state.chosenWordDefinition.title = action.payload.meta.id;
      state.chosenWordDefinition.abbreviation = action.payload.fl;
      state.chosenWordDefinition.shortDef = action.payload.shortdef;
      state.chosenWordDefinition.senses.push(
        action.payload.def[0].sseq[0][0][1].dt
      );
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
        state.suggestedWord = action.payload;
      })
      .addCase(getWordDefinition.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWordDefinition.rejected, (state) => {
        state.isLoading = true;
      });
  },
});

export const { resetSuggestedWord, addChosenWordDefinition } =
  wordDefinition.actions;
export default wordDefinition.reducer;
