import axios from "axios";
import { postBook, setPostBookIsLoading } from "../slices/book.slice";
import { axiosTo } from "../../utils/promise";
import store from "../store";
import ApiError from "../../classes/ApiError";

const apiError = new ApiError();
const originUrl = window.location.origin;

interface Params {
  userId: string | number;
  bookName: string;
}

async function createBook(payload: Params) {
  store.dispatch(setPostBookIsLoading(true));
  // eslint-disable-next-line
  const [bookExistsErr, _bookExistsRes] = await axiosTo(
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
