/* eslint-disable eqeqeq */
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { addToastNotificationArr } from "./state.slice";
import { ApiCall, ApiTracker } from "../apis/apiTracker";
import { axiosTo } from "../../utils/promise";
import { GLOBALVARS } from "../../utils/GLOBALVARS";
import { BookRes } from "./book.slice";
const apiTracker = new ApiTracker();

// api url with query passed through as parameter
function apiUrl(queriedWord: string) {
  queriedWord = queriedWord.replace(/[^\w\s]/g, "");
  return `https://dictionaryapi.com/api/v3/references/sd4/json/${queriedWord}?key=${
    import.meta.env.VITE_DICTIONARY_KEY
  }`;
  // return `https://dictionaryapi.com/api/v3/references/ithesaurus/json/${queriedWord}?key=${process.env.REACT_APP_DICTIONARY_KEY}`;
}

export interface AllWordsInBook extends ChosenWordDefinition {
  id: string | number | null;
}

export interface ChosenWordDefinition {
  title: string;
  examples: string[];
  abbreviation: string;
  shortDef: string[];
}

interface IsOriginatedFromUrl {
  word: string | null;
  isFromSearchBar: boolean;
}

interface InitialState {
  suggestedWord: any[];
  isWordChosen: boolean;
  chosenWordDefinition: ChosenWordDefinition;
  allWordsFromBook: AllWordsInBook[];
  isLoading: boolean;
  isSavingWordLoading: boolean;
  isGetWordLoading: boolean;
  isDeleteWordLoading: boolean;
  isOriginatedFromUrl: IsOriginatedFromUrl;
}

// action initialstate
const initialState: InitialState = {
  suggestedWord: [],
  isWordChosen: false,
  chosenWordDefinition: {
    title: "",
    examples: [],
    abbreviation: "",
    shortDef: [],
  },
  allWordsFromBook: [],
  isLoading: true,
  isSavingWordLoading: true,
  isGetWordLoading: true,
  isDeleteWordLoading: true,
  isOriginatedFromUrl: {
    word: null,
    isFromSearchBar: false,
  },
};

// exported api call
export const getWordDefinition = createAsyncThunk(
  "getWordDefinition",
  async (queriedWord: string, _thunkApi) => {
    const [err, res] = await axiosTo(axios.get(apiUrl(queriedWord)));
    // console.log("fetched data ", resp.data);
    if (err) {
      if (err.data.includes("time out")) {
        addToastNotificationArr(GLOBALVARS.ERROR_TIMEOUT);
        return;
      }
      addToastNotificationArr("Merriam Webster API is down.");
      return;
    }
    return res;
  }
);

export const postWordToBook = createAsyncThunk(
  "postWordToBook",
  async (payload: any, thunkApi) => {
    // eslint-disable-next-line
    const [err, _res] = await axiosTo(axios.post("/api/postWord", payload));
    const { bookName } = payload.bookObj;
    // payload.bookObj.properties[bookSchema.BOOK_NAME].rich_text[0].plain_text;
    if (err) {
      if (err.data.includes("time out")) {
        thunkApi.dispatch(addToastNotificationArr(GLOBALVARS.ERROR_TIMEOUT));
        console.error(err.data);
        return;
      }
      thunkApi.dispatch(
        addToastNotificationArr(
          `Something went wrong adding word to ${bookName}. Please try again.`
        )
      );
      console.error(err.data);
      return;
    }

    thunkApi.dispatch(addToastNotificationArr(`Word added to ${bookName}`));
    return bookName;
  }
);

// interface GetWordsInBookPayload extends BookRes {
//   abortController: AbortController | null;
// }

export const getWordsInBook = createAsyncThunk(
  "getWordsInBook",
  async (payload: BookRes, _thunkApi) => {
    let res: any;
    const apiCall: ApiCall = {
      id: payload.id,
      abortController: new AbortController(),
      method: "post",
      url: "/api/getAllWord",
      payload: payload,
    };
    res = await apiTracker.callApi(apiCall, (data) => data);

    // const [err, res] = payload.abortController
    //   ? await axiosTo(
    //       axios.post("/api/getAllWord", payload, {
    //         signal: payload.abortController.signal,
    //       })
    //     )
    //   : await axiosTo(axios.post("/api/getAllWord", payload));
    // if (err) {
    //   if (err.data.includes("time out")) {
    //     thunkApi.dispatch(addToastNotificationArr(GLOBALVARS.ERROR_TIMEOUT));
    //     console.error(err.data);
    //     return;
    //   }
    //   thunkApi.dispatch(
    //     addToastNotificationArr(GLOBALVARS.ERROR_GETTING_WORDS_IN_BOOK)
    //   );
    //   console.error(err.data);
    //   return;
    // }
    return res.data;
  }
);

export const deleteWord = createAsyncThunk(
  "deleteWord",
  async (payload: { wordId: string | number }, thunkApi) => {
    const [err, res] = await axiosTo(axios.put("/api/deleteWord", payload));
    if (err) {
      if (err.data.includes("time out")) {
        thunkApi.dispatch(addToastNotificationArr(GLOBALVARS.ERROR_TIMEOUT));
        console.error(err.data);
        return;
      }
      thunkApi.dispatch(addToastNotificationArr(`Error deleting word.`));
      console.error(err.data);
      return;
    }
    return res;
  }
);

// redux slice
const word = createSlice({
  name: "word",
  initialState,
  reducers: {
    resetSuggestedWord: (state: InitialState) => {
      while (state.suggestedWord.length > 1) {
        state.suggestedWord.pop();
      }
    },
    addChosenWordDefinition: (
      state: InitialState,
      action: PayloadAction<any>
    ) => {
      state.isWordChosen = true;
      console.log("chosen word raw def ", action.payload);
      // console.log(action.payload.def[0].sseq[0][0][1].dt);
      state.chosenWordDefinition.title = action.payload.meta.id;
      state.chosenWordDefinition.abbreviation = action.payload.fl;

      if (Object.keys(action.payload).includes("cxs")) {
        // state.chosenWordDefinition.examples.push(action.payload.cxs);
        const shortDef = [];
        for (const pastTenseWordObj of action.payload.cxs) {
          const definition = `${pastTenseWordObj.cxl} ${pastTenseWordObj.cxtis[0].cxt}`;
          shortDef.push(definition);
        }
        state.chosenWordDefinition.shortDef = shortDef;
      } else {
        state.chosenWordDefinition.shortDef = action.payload.shortdef;

        for (const _sense of action.payload.def[0].sseq) {
          for (const sense of _sense) {
            if (sense[1]?.dt?.length > 1 && sense[1].dt[1][0] === "vis") {
              // t.t.replace(/\{it\}(.*?)\{\/it\}/g, "<i>$1</i>")

              sense[1].dt[1][1].forEach((ele: any) => {
                state.chosenWordDefinition.examples.push(
                  // ele.t.replace(/\{it\}(.*?)\{\/it\}/g, "{0}")
                  ele.t
                );
              });
            } else {
              state.chosenWordDefinition.examples = [];
            }
          }
        }
      }
      // }
    },
    resetChosenWordDefinition: (state: InitialState) => {
      state.chosenWordDefinition = {
        title: "",
        examples: [],
        abbreviation: "",
        shortDef: [],
      };
    },
    addIsOriginatedFromUrlWord: (
      state: InitialState,
      action: PayloadAction<string>
    ) => {
      if (action.payload.length > 0) {
        if (state.chosenWordDefinition.title != action.payload) {
          state.isOriginatedFromUrl.word = action.payload;
        }
      }
    },
    resetIsOriginatedFromUrlWord: (state: InitialState) => {
      state.isOriginatedFromUrl.word = null;
    },
    setIsFromSearchBar: (
      state: InitialState,
      action: PayloadAction<boolean>
    ) => {
      state.isOriginatedFromUrl.isFromSearchBar = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWordDefinition.fulfilled, (state: InitialState, action) => {
        state.isLoading = false;
        console.log("suggestedWord, ", action.payload);
        state.suggestedWord = action.payload;
      })
      .addCase(getWordDefinition.pending, (state: InitialState) => {
        state.isLoading = true;
      })
      .addCase(getWordDefinition.rejected, (state: InitialState) => {
        state.isLoading = true;
      })
      .addCase(postWordToBook.fulfilled, (state: InitialState) => {
        state.isSavingWordLoading = false;
      })
      .addCase(postWordToBook.pending, (state: InitialState) => {
        state.isSavingWordLoading = true;
      })
      .addCase(postWordToBook.rejected, (state: InitialState) => {
        state.isSavingWordLoading = true;
      })
      .addCase(
        getWordsInBook.fulfilled,
        (state: InitialState, action: PayloadAction<AllWordsInBook[]>) => {
          console.log("all words for book ??????????? ", action.payload);

          if (action.payload?.length) {
            for (const wordDefinition of action.payload) {
              wordDefinition.examples = JSON.parse(
                String(wordDefinition.examples)
              );
              wordDefinition.shortDef = JSON.parse(
                String(wordDefinition.shortDef)
              );
            }
          }
          state.allWordsFromBook = action.payload;
          state.isGetWordLoading = false;
        }
      )
      .addCase(getWordsInBook.pending, (state: InitialState) => {
        state.isGetWordLoading = true;
      })
      .addCase(getWordsInBook.rejected, (state: InitialState) => {
        state.isGetWordLoading = true;
      })
      .addCase(deleteWord.fulfilled, (state: InitialState) => {
        state.isDeleteWordLoading = false;
      })
      .addCase(deleteWord.pending, (state: InitialState) => {
        state.isDeleteWordLoading = true;
      })
      .addCase(deleteWord.rejected, (state: InitialState) => {
        state.isDeleteWordLoading = true;
      });
  },
});

export const {
  resetSuggestedWord,
  addChosenWordDefinition,
  resetChosenWordDefinition,
  addIsOriginatedFromUrlWord,
  resetIsOriginatedFromUrlWord,
  setIsFromSearchBar,
} = word.actions;
export default word;
