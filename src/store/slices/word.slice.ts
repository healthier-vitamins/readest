import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { addToastNotificationArr } from "./state.slice";
import { bookSchema } from "../../utils/schemas/bookSchema";

// api url with query passed through as parameter
function apiUrl(queriedWord: string) {
  return `https://dictionaryapi.com/api/v3/references/sd4/json/${queriedWord}?key=${process.env.REACT_APP_DICTIONARY_KEY}`;
  // return `https://dictionaryapi.com/api/v3/references/ithesaurus/json/${queriedWord}?key=${process.env.REACT_APP_DICTIONARY_KEY}`;
}

type ChosenWordDefinition = {
  title: string;
  senseArr: any[];
  abbreviation: string;
  shortDef: string;
};

interface InitialState {
  suggestedWord: any[];
  isWordChosen: boolean;
  chosenWordDefinition: ChosenWordDefinition;
  allBookWord: any;
  isLoading: boolean;
  isSavingWordLoading: boolean;

  isGetWordLoading: boolean;
}

// action initialstate
const initialState: InitialState = {
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
  isSavingWordLoading: true,

  isGetWordLoading: true,
};

// exported api call
export const getWordDefinition = createAsyncThunk(
  "getWordDefinition",
  async (queriedWord: string, thunkApi) => {
    const resp = await axios.get(apiUrl(queriedWord));
    // console.log("fetched data ", resp.data);
    return resp.data;
  }
);

export const postWordToBook = createAsyncThunk(
  "postWordToBook",
  async (payload: any, thunkApi) => {
    const resp = await axios.post("/api/postWord", payload);
    const bookName =
      payload.bookObj.properties[bookSchema.BOOK_NAME].rich_text[0].plain_text;
    if (resp.status === 200) {
      thunkApi.dispatch(addToastNotificationArr(`Word added to ${bookName}`));
    }
    // console.log(
    //   "saved word res ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| ",
    //   )
    return bookName;
  }
);

export const getWordForBook = createAsyncThunk(
  "getWordForBook",
  async (payload: any, thunkApi) => {
    const abortController = payload?.abortController;
    console.log("abort controller ein api ||||||||||| ", abortController);
    let resp;
    if (abortController) {
      console.log("with abortController");
      resp = await axios.post("/api/getAllWord", payload, {
        signal: abortController,
      });
    } else {
      console.log("without abortController");
      resp = await axios.post("/api/getAllWord", payload);
    }
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
        state.isSavingWordLoading = false;
      })
      .addCase(postWordToBook.pending, (state) => {
        state.isSavingWordLoading = true;
      })
      .addCase(postWordToBook.rejected, (state) => {
        state.isSavingWordLoading = true;
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

export const { resetSuggestedWord, addChosenWordDefinition } = word.actions;
export default word;
