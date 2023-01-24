import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { resetbookResArrCheckbox } from "./book.slice";
import { toggleSaveWordModal } from "./state.slice";

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
    senseArr: [],
    abbreviation: "",
    shortDef: "",
  },
  isLoading: true,
  isSavingLoading: true,
};

// exported api call
export const getWordDefinition = createAsyncThunk(
  "getWordDefinition",
  async (queriedWord, thunkApi) => {
    const resp = await axios.get(apiUrl(queriedWord));
    // console.log("fetched data ", resp.data);
    return resp.data;
  }
);

export const postWordToBook = createAsyncThunk(
  "postWordToBook",
  async (payload, thunkApi) => {
    const resp = await await axios.post("/api/postWord", payload);
    if (resp.status === 200) {
      thunkApi.dispatch(toggleSaveWordModal());
      thunkApi.dispatch(resetbookResArrCheckbox());
    }
    return resp.data;
  }
);

// redux slice
const word = createSlice({
  name: "word",
  initialState,
  reducers: {
    resetSuggestedWord: (state) => {
      while (state.suggestedWord.length > 1) {
        state.suggestedWord.pop();
      }
    },
    addChosenWordDefinition: (state, action) => {
      state.isWordChosen = true;
      console.log("chosen word raw def ", action.payload);
      // console.log(action.payload.def[0].sseq[0][0][1].dt);
      state.chosenWordDefinition.title = action.payload.meta.id;
      state.chosenWordDefinition.abbreviation = action.payload.fl;

      if (Object.keys(action.payload).includes("cxs")) {
        state.chosenWordDefinition.senseArr.push(action.payload.cxs);
        state.chosenWordDefinition.shortDef = action.payload.cxs;
      } else {
        state.chosenWordDefinition.shortDef = action.payload.shortdef;
        state.chosenWordDefinition.senseArr.push(
          action.payload.def[0].sseq[0][0][1].dt
        );
      }
    },
  },
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
      })
      .addCase(postWordToBook.fulfilled, (state, action) => {
        state.isSavingLoading = false;
      })
      .addCase(postWordToBook.pending, (state) => {
        state.isSavingLoading = true;
      })
      .addCase(postWordToBook.rejected, (state) => {
        state.isSavingLoading = true;
      });
  },
});

export const { resetSuggestedWord, addChosenWordDefinition } = word.actions;
export default word.reducer;
