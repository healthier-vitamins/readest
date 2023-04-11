import axios from "axios";
import { createCancelTokenHandler } from "./cancelApiHandler";

export const Words = {
  getWordForBook: function (payload: any) {
    return axios.post("/api/getAllWord", payload, {
      signal:
        cancelTokenHandlerObject[this.getWordForBook.name]
          .handleRequestCancellation.signal,
    });
  },
};

const cancelTokenHandlerObject = createCancelTokenHandler(Words);
