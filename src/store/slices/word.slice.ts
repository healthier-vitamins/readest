/* eslint-disable eqeqeq */
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { addToastNotificationArr } from "./state.slice";
import { axiosTo } from "utils/promise";
import { ApiCall, ApiTracker } from "utils/apis/apiTracker";
const apiTracker = new ApiTracker();

// api url with query passed through as parameter
function apiUrl(queriedWord: string) {
  return `https://dictionaryapi.com/api/v3/references/sd4/json/${queriedWord}?key=${process.env.REACT_APP_DICTIONARY_KEY}`;
  // return `https://dictionaryapi.com/api/v3/references/ithesaurus/json/${queriedWord}?key=${process.env.REACT_APP_DICTIONARY_KEY}`;
}

// interface Examples {
//   sense: string;
//   example: string;
// }

export type ChosenWordDefinition = {
  title: string;
  examples: string[];
  abbreviation: string;
  shortDef: string;
  transitive: string[];
};

interface IsOriginatedFromUrl {
  word: string | null;
  isFromSearchBar: boolean;
}

interface InitialState {
  suggestedWord: any[];
  isWordChosen: boolean;
  chosenWordDefinition: ChosenWordDefinition;
  allBookWord: any;
  isLoading: boolean;
  isSavingWordLoading: boolean;

  isGetWordLoading: boolean;
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
    shortDef: "",
    transitive: [],
  },
  allBookWord: null,
  isLoading: true,
  isSavingWordLoading: true,
  isGetWordLoading: true,
  isOriginatedFromUrl: {
    word: null,
    isFromSearchBar: false,
  },
};

// exported api call
export const getWordDefinition = createAsyncThunk(
  "getWordDefinition",
  async (queriedWord: string, thunkApi) => {
    const [err, res] = await axiosTo(axios.get(apiUrl(queriedWord)));
    // console.log("fetched data ", resp.data);
    if (err) {
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
    const [err, res] = await axiosTo(axios.post("/api/postWord", payload));
    const { bookName } = payload.bookObj;
    // payload.bookObj.properties[bookSchema.BOOK_NAME].rich_text[0].plain_text;
    if (err) {
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

export const getWordForBook = createAsyncThunk(
  "getWordForBook",
  async (payload: any, thunkApi) => {
    let res: any;
    const apiCall: ApiCall = {
      id: payload.bookId,
      abortController: new AbortController(),
      method: "post",
      url: "/api/getAllWord",
      payload: payload,
    };
    res = await apiTracker.callApi(apiCall, (data) => {
      return data.data;
    });
    return res.data;
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

      // if (Object.keys(action.payload).includes("cxs")) {
      //   state.chosenWordDefinition.examples.push(action.payload.cxs);
      //   state.chosenWordDefinition.shortDef = action.payload.cxs;
      // } else {
      state.chosenWordDefinition.shortDef = action.payload.shortdef;
      // state.chosenWordDefinition.examples.push(
      // action.payload.def[0].sseq[0][0][1].dt)

      for (let _sense of action.payload.def[0].sseq) {
        for (let sense of _sense) {
          console.log("sense ", sense);
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
      // }
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
        state.suggestedWord = action.payload;
      })
      .addCase(getWordDefinition.pending, (state: InitialState) => {
        state.isLoading = true;
      })
      .addCase(getWordDefinition.rejected, (state: InitialState) => {
        state.isLoading = true;
      })
      .addCase(postWordToBook.fulfilled, (state: InitialState, action) => {
        state.isSavingWordLoading = false;
      })
      .addCase(postWordToBook.pending, (state: InitialState) => {
        state.isSavingWordLoading = true;
      })
      .addCase(postWordToBook.rejected, (state: InitialState) => {
        state.isSavingWordLoading = true;
      })
      .addCase(getWordForBook.fulfilled, (state: InitialState, action) => {
        console.log("all words for book ??????????? ", action.payload);
        state.allBookWord = action.payload;
        state.isGetWordLoading = false;
      })
      .addCase(getWordForBook.pending, (state: InitialState) => {
        state.isGetWordLoading = true;
      })
      .addCase(getWordForBook.rejected, (state: InitialState) => {
        state.isGetWordLoading = true;
      });
  },
});

export const {
  resetSuggestedWord,
  addChosenWordDefinition,
  addIsOriginatedFromUrlWord,
  resetIsOriginatedFromUrlWord,
  setIsFromSearchBar,
} = word.actions;
export default word;
