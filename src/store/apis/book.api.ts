import { axiosTo } from "../../utils/promise";
import { createAsyncThunk } from "@reduxjs/toolkit";
import httpClient from "../../utils/httpclient/HTTPClient";
import {
  addToastNotificationArr,
  toggleCreateBookModal,
} from "../slices/state.slice";
import { checkAndHandleTimeoutError } from "./timeoutHandler";
import Cookies from "universal-cookie";
import { GLOBALVARS } from "../../utils/GLOBALVARS";
const cookies = new Cookies();

export interface CreateBookPayload {
  userId: string | number;
  bookName: string;
}

export const createBook = createAsyncThunk(
  "createBook",
  async (payload: CreateBookPayload, thunkApi) => {
    const [bookExistsErr, _bookExistsRes] = await axiosTo(
      httpClient.Get(`checkIfBookExists`, payload)
    );
    if (bookExistsErr) {
      if (checkAndHandleTimeoutError(bookExistsErr, null)) {
        thunkApi.dispatch(addToastNotificationArr(bookExistsErr.data));
        return thunkApi.rejectWithValue(bookExistsErr.data);
      }
    }

    const [err, res] = await axiosTo(httpClient.Post(`postBook`, payload));
    if (err) {
      if (checkAndHandleTimeoutError(err, null)) {
        thunkApi.dispatch(addToastNotificationArr(err.data));
        return thunkApi.rejectWithValue(err.data);
      }
    }
    thunkApi.dispatch(toggleCreateBookModal());
    thunkApi.dispatch(getAllBook());
    return res;
  }
);

export const checkIfBookExists = createAsyncThunk(
  "checkIfBookExists",
  async (payload: CreateBookPayload, thunkApi) => {
    const [bookExistsErr, bookExistsRes] = await axiosTo(
      httpClient.Get(`checkIfBookExists`, payload)
    );
    if (bookExistsErr) {
      if (checkAndHandleTimeoutError(bookExistsErr, null)) {
        thunkApi.dispatch(addToastNotificationArr(bookExistsErr.data));
        return thunkApi.rejectWithValue(bookExistsErr.data);
      }
    }
    return bookExistsRes;
  }
);

// get books
export const getAllBook = createAsyncThunk(
  "getAllBook",
  async (payload: string | undefined, thunkApi) => {
    let userId;
    if (!payload) {
      userId = cookies.get("user-id");
      if (!userId) {
        return thunkApi.rejectWithValue(GLOBALVARS.ERROR_ACCESSING_BOOK_DB);
      }
    } else {
      userId = payload;
    }

    const [err, res] = await axiosTo(
      httpClient.Get(`getAllBook`, { userId: userId })
    );
    if (err) {
      if (checkAndHandleTimeoutError(err, null)) {
        thunkApi.dispatch(addToastNotificationArr(err.data));
        return thunkApi.rejectWithValue(err.data);
      }
    }
    return res;
  }
);
