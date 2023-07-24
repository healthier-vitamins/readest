import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosTo } from "../../utils/promise";
import httpClient from "../../utils/httpclient/HTTPClient";
import { GLOBALVARS } from "../../utils/GLOBALVARS";
import { addToastNotificationArr } from "../slices/state.slice";
import { checkAndHandleTimeoutError } from "./timeoutHandler";
import axios from "axios";
import apiTracker, { ApiCall } from "./apiTracker";
import { BookRes } from "../slices/book.slice";

// api url with query passed through as parameter
function apiUrl(queriedWord: string) {
  queriedWord = queriedWord.replace(/[^\w\s]/g, "");
  return `https://dictionaryapi.com/api/v3/references/sd4/json/${queriedWord}?key=${
    import.meta.env.VITE_DICTIONARY_KEY
  }`;
  // return `https://dictionaryapi.com/api/v3/references/ithesaurus/json/${queriedWord}?key=${process.env.REACT_APP_DICTIONARY_KEY}`;
}

// exported api call
export const getWordDefinition = createAsyncThunk(
  "getWordDefinition",
  async (queriedWord: string, thunkApi) => {
    const [err, res] = await axiosTo(axios.get(apiUrl(queriedWord)));
    if (err) {
      if (checkAndHandleTimeoutError(err, null)) {
        thunkApi.dispatch(
          addToastNotificationArr(GLOBALVARS.ERROR_MERRIAM_WEBSTER_DOWN)
        );
        return;
      }
    }
    return res;
  }
);

export const postWordToBook = createAsyncThunk(
  "postWordToBook",
  async (payload: any, thunkApi) => {
    // eslint-disable-next-line
    const [err, _res] = await axiosTo(httpClient.Post("postWord", payload));
    const { bookName } = payload.bookObj;
    // payload.bookObj.properties[bookSchema.BOOK_NAME].rich_text[0].plain_text;
    if (err) {
      if (checkAndHandleTimeoutError(err, null)) {
        thunkApi.dispatch(
          addToastNotificationArr(
            `Something went wrong adding word to ${bookName}. Please try again.`
          )
        );
        return;
      }
    }

    thunkApi.dispatch(addToastNotificationArr(`Word added to ${bookName}`));
    return bookName;
  }
);

export const getWordsInBook = createAsyncThunk(
  "getWordsInBook",
  async (payload: BookRes, thunkApi) => {
    console.log("🚀 ~ file: word.api.ts:62 ~ payload:", payload);
    const apiCall: ApiCall = {
      id: payload.id,
      abortController: new AbortController(),
      method: "post",
      //   url: "/api/getAllWord",
      url: "getAllWord",
      payload: payload,
    };

    apiTracker.setApiCallMap(apiCall);
    const newApiCall = apiTracker.getApiCallMap(apiCall.url);
    if (newApiCall) {
      const [err, res] = await axiosTo(
        httpClient.Get(
          newApiCall.url,
          newApiCall.payload,
          newApiCall.abortController
        )
      );

      if (err) {
        if (checkAndHandleTimeoutError(err, null)) {
          thunkApi.dispatch(
            addToastNotificationArr(GLOBALVARS.ERROR_GETTING_WORDS_IN_BOOK)
          );
          return;
        }
      }

      // let res = await apiTracker.callApi(apiCall, (data) => data);

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
      return res;
    } else {
      return [];
    }
  }
);
