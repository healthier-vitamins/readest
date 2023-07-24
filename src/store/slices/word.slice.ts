/* eslint-disable eqeqeq */
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { addToastNotificationArr } from "./state.slice";
import { axiosTo } from "../../utils/promise";
import { GLOBALVARS } from "../../utils/GLOBALVARS";
import {
  getWordDefinition,
  getWordsInBook,
  postWordToBook,
} from "../apis/word.api";

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
  isGetWordDefinitionLoading: boolean;
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
  isGetWordDefinitionLoading: false,
  isSavingWordLoading: false,
  isGetWordLoading: false,
  isDeleteWordLoading: false,
  isOriginatedFromUrl: {
    word: null,
    isFromSearchBar: false,
  },
};

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
    setGetWordIsLoading: (state) => {
      state.isGetWordLoading = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWordDefinition.fulfilled, (state: InitialState, action) => {
        state.isGetWordDefinitionLoading = false;
        console.log("suggestedWord, ", action.payload);
        state.suggestedWord = action.payload;
      })
      .addCase(getWordDefinition.pending, (state: InitialState) => {
        state.isGetWordDefinitionLoading = true;
      })
      .addCase(getWordDefinition.rejected, (state: InitialState) => {
        state.isGetWordDefinitionLoading = false;
      })
      .addCase(postWordToBook.fulfilled, (state: InitialState) => {
        state.isSavingWordLoading = false;
      })
      .addCase(postWordToBook.pending, (state: InitialState) => {
        state.isSavingWordLoading = true;
      })
      .addCase(postWordToBook.rejected, (state: InitialState) => {
        state.isSavingWordLoading = false;
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

          // if empty list === empty book. undefined due to abortController.
          if (action.payload !== undefined && action.payload.length !== 0) {
            state.allWordsFromBook = action.payload;
            state.isGetWordLoading = false;
          } else {
            state.isGetWordLoading = true;
          }
        }
      )
      .addCase(getWordsInBook.pending, (state: InitialState) => {
        state.isGetWordLoading = true;
      })
      .addCase(getWordsInBook.rejected, (state: InitialState) => {
        state.isGetWordLoading = false;
      })
      .addCase(deleteWord.fulfilled, (state: InitialState) => {
        state.isDeleteWordLoading = false;
      })
      .addCase(deleteWord.pending, (state: InitialState) => {
        state.isDeleteWordLoading = true;
      })
      .addCase(deleteWord.rejected, (state: InitialState) => {
        state.isDeleteWordLoading = false;
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
  setGetWordIsLoading,
} = word.actions;
export default word;
