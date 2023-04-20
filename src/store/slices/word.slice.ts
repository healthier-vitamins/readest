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

export type ChosenWordDefinition = {
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
  urlRedirectWord: string | null;
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
  urlRedirectWord: null,
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
    const [err, res] = await axiosTo(axios.post("/api/postWord", payload));
    console.log("RES ???????????????? ", res);
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
    console.log("DATA PLEASE WORK? ||||||| ", res);
    return res.data;

    // const [err, res] = await axiosTo(axios.post("/api/getAllWord", payload));
    // if (err) {
    //   thunkApi.dispatch(
    //     addToastNotificationArr(
    //       "Something went wrong getting words. Please try again."
    //     )
    //   );
    //   console.error("ERRRRR |||||||||||| ", err.data);
    //   return;
    // }
    // console.log("ressss ||||||||||| ", res);
    // return res;
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
        state.chosenWordDefinition.senseArr.push(action.payload.cxs);
        state.chosenWordDefinition.shortDef = action.payload.cxs;
      } else {
        state.chosenWordDefinition.shortDef = action.payload.shortdef;
        state.chosenWordDefinition.senseArr.push(
          action.payload.def[0].sseq[0][0][1].dt
        );
      }
    },
    addUrlRedirectWord: (
      state: InitialState,
      action: PayloadAction<string>
    ) => {
      if (action.payload.length > 0) {
        if (state.chosenWordDefinition.title != action.payload) {
          state.urlRedirectWord = action.payload;
        }
      }
    },
    resetUrlRedirectWord: (state: InitialState) => {
      state.urlRedirectWord = null;
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
        console.log("fulfiled ??????????? ", action.payload);
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
  addUrlRedirectWord,
  resetUrlRedirectWord,
} = word.actions;
export default word;
