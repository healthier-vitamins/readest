/* eslint-disable eqeqeq */
import axios from "axios";
import ApiError from "../../classes/ApiError";
import { AllWordsInBook, setGetWordIsLoading } from "../slices/word.slice";
import store from "../store";
const apiError = new ApiError();

export interface ApiCall {
  id: string;
  url: string;
  method: "get" | "post" | "put" | "delete";
  payload?: any;
  abortController: AbortController;
}

class ApiTracker {
  private apiCalls: Map<string, ApiCall>;
  // private previousApiCall: ApiCall | null;

  constructor() {
    this.apiCalls = new Map();
    // this.previousApiCall = null;
  }

  setApiCallMap(apiCall: ApiCall) {
    const { url } = apiCall;
    if (this.apiCalls.has(url)) {
      this.apiCalls.get(url)?.abortController.abort();
      // store.dispatch(setGetWordIsLoading());
      console.log("aborted");
    }
    this.apiCalls.set(url, apiCall);
  }

  getApiCallMap(url: string) {
    if (!this.apiCalls.has(url)) return null;
    return this.apiCalls.get(url);
  }

  /**
   * @deprecated
   * @param apiCall
   * @returns
   */
  private async executeApiCall(apiCall: ApiCall): Promise<any> {
    const { url, method, payload, abortController } = apiCall;

    if (this.apiCalls.has(url)) {
      this.apiCalls.get(url)?.abortController.abort();
    }
    this.apiCalls.set(url, apiCall);

    let response;
    switch (method) {
      case "get":
        response = axios.get(url, { signal: abortController.signal });
        break;
      case "post":
        response = axios.post(url, payload, {
          signal: abortController.signal,
        });
        break;
      case "put":
        response = axios.put(url, payload, {
          signal: abortController.signal,
        });
        break;
      case "delete":
        response = axios.delete(url, { signal: abortController.signal });
        break;
      default:
        throw new Error("Invalid API method specified.");
    }

    // this.previousApiCall = apiCall;
    return response;
  }

  //   public addApiCall(apiCall: ApiCall): void {
  //     this.apiCalls.set(apiCall.id, apiCall);
  //   }

  /**
   * @deprecated
   * @param apiCall
   * @param onSuccess
   * @returns
   */
  public async callApi(
    apiCall: ApiCall,
    onSuccess: (data: any) => void
  ): Promise<AllWordsInBook[]> {
    // console.log("previous id ", this.previousApiCall?.id);
    // if (this.previousApiCall?.id) {
    //   this.previousApiCall?.abortController.abort();
    //   this.previousApiCall = apiCall;
    // }

    try {
      const responseData = await this.executeApiCall(apiCall);
      onSuccess(responseData);
      // this.previousApiCall = null;
      return responseData;
    } catch (error: any) {
      console.error("API call cancelled:", error);
      throw apiError.dispatchErrorNotification(
        error.response.data,
        error.response.status
      );
    }
  }
}

const apiTracker = new ApiTracker();
export default apiTracker;
