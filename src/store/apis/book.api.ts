import { getAllBook } from "../slices/book.slice";
import { axiosTo } from "../../utils/promise";
import { createAsyncThunk } from "@reduxjs/toolkit";
import httpClient from "../../utils/httpclient/HTTPClient";
import {
  addToastNotificationArr,
  toggleCreateBookModal,
} from "../slices/state.slice";
import { checkAndHandleTimeoutError } from "./timeoutHandler";

interface CreateBookPayload {
  userId: string | number;
  bookName: string;
}

// async function createBook(payload: Params) {
//   store.dispatch(setPostBookIsLoading(true));
//   // eslint-disable-next-line
//   const [bookExistsErr, _bookExistsRes] = await axiosTo(
//     axios.get(`${originUrl}/api/checkIfBookExists`, { params: payload })
//   );
//   if (bookExistsErr) {
//     store.dispatch(setPostBookIsLoading(false));
//     apiError.dispatchErrorNotification(
//       bookExistsErr.data,
//       bookExistsErr.status
//     );
//   }
//   store.dispatch(postBook(payload));
// }

const createBook = createAsyncThunk(
  "createBook",
  async (payload: CreateBookPayload, thunkApi) => {
    const [bookExistsErr, _bookExistsRes] = await axiosTo(
      httpClient.Get(`checkIfBookExists`, { params: payload })
    );
    if (bookExistsErr) {
      if (checkAndHandleTimeoutError(bookExistsErr, null)) {
        thunkApi.dispatch(addToastNotificationArr(bookExistsErr.data));
        return;
      }
    }

    const [err, res] = await axiosTo(httpClient.Post(`postBook`, payload));
    if (err) {
      if (checkAndHandleTimeoutError(bookExistsErr, null)) {
        thunkApi.dispatch(addToastNotificationArr(err.data));
        return;
      }
    }
    thunkApi.dispatch(toggleCreateBookModal());
    thunkApi.dispatch(getAllBook());
    return res;
  }
);

export { createBook };
