import axios from "axios";
import ApiError from "classes/ApiError";
import { postBook, setPostBookIsLoading } from "store/slices/book.slice";
import store from "store/store";
import { axiosTo } from "utils/promise";

const apiError = new ApiError();
const originUrl = window.location.origin;

interface Params {
  userId: string | number;
  bookName: string;
}

async function createBook(payload: Params) {
  store.dispatch(setPostBookIsLoading(true));
  // eslint-disable-next-line
  const [bookExistsErr, bookExistsRes] = await axiosTo(
    axios.get(`${originUrl}/api/checkIfBookExists`, { params: payload })
  );
  if (bookExistsErr) {
    store.dispatch(setPostBookIsLoading(false));
    apiError.dispatchErrorNotification(
      bookExistsErr.data,
      bookExistsErr.status
    );
  }
  store.dispatch(postBook(payload));
}

export { createBook };
