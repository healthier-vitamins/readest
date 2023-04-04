import { getWordForBook } from "store/slices/word.slice";
import store from "store/store";

// let abortController: any;

function getAllWordsForBook(payload: any) {
  //   console.log("abortController |||||||| ", abortController);
  //   if (abortController) abortController.abort();
  //   const newAbortController = new AbortController();
  //   abortController = newAbortController;
  //   console.log("after abortController |||||||| ", abortController);
  //   payload.abortController = newAbortController;
  store.dispatch(getWordForBook(payload));
}

export { getAllWordsForBook };
