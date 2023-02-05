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
  allBookWord: null,
  isLoading: true,
  isSavingLoading: true,
  isGetWordLoading: true,
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
    const resp = await axios.post("/api/postWord", payload);
    // if (resp.status === 200) {
    //   thunkApi.dispatch(toggleSaveWordModal());
    //   thunkApi.dispatch(resetbookResArrCheckbox());
    // }
    return resp.data;
  }
);

export const getWordForBook = createAsyncThunk(
  "getWordForBook",
  async (payload, thunkApi) => {
    const resp = await axios.post("/api/getAllWord", payload);
    // if (resp.status === 200) {
    // }
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
    toggleIsSavingLoading: (state) => {
      state.isSavingLoading = !state.isSavingLoading;
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
      })
      .addCase(getWordForBook.fulfilled, (state, action) => {
        state.allBookWord = action.payload;
        state.isGetWordLoading = false;
      })
      .addCase(getWordForBook.pending, (state) => {
        state.isGetWordLoading = true;
      })
      .addCase(getWordForBook.rejected, (state) => {
        state.isGetWordLoading = true;
      });
  },
});

export const {
  resetSuggestedWord,
  addChosenWordDefinition,
  toggleIsSavingLoading,
} = word.actions;
export default word.reducer;
