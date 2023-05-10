/* eslint-disable eqeqeq */
import axios from "axios";
import ApiError from "classes/ApiError";
import { AllWordsInBook } from "store/slices/word.slice";
const apiError = new ApiError();

interface ApiCall {
  id: string;
  url: string;
  method: "get" | "post" | "put" | "delete";
  payload?: any;
  abortController: AbortController;
}

export class ApiTracker {
  //   private apiCalls: Map<string, ApiCall>;
  private previousApiCall: ApiCall | null;

  constructor() {
    // this.apiCalls = new Map();
    this.previousApiCall = null;
  }

  private async executeApiCall(apiCall: ApiCall): Promise<any> {
    const { url, method, payload, abortController } = apiCall;

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

    this.previousApiCall = apiCall;

    return response;
  }

  //   public addApiCall(apiCall: ApiCall): void {
  //     this.apiCalls.set(apiCall.id, apiCall);
  //   }

  public async callApi(
    apiCall: ApiCall,
    onSuccess: (data: any) => void
  ): Promise<AllWordsInBook[]> {
    if (this.previousApiCall?.id !== apiCall.id) {
      this.previousApiCall?.abortController.abort();
      this.previousApiCall = apiCall;
    }

    try {
      const responseData = await this.executeApiCall(apiCall);
      onSuccess(responseData);
      this.previousApiCall = null;
      return responseData;
    } catch (error: any) {
      console.error("API call cancelled:", error);
      throw apiError.dispatchErrorNotification(
        error.response.data,
        error.response.status
      );
    }

    // else {

    //   const [err, res] = await axiosTo(this.executeApiCall(apiCall));
    //   if (err) {
    //     console.error("API call cancelled:", err);
    //     // const isTimeOut =
    //     //   err.data.includes("time out") || err.status == 500 || err.status == 502;
    //     throw new ApiError(err.data, err.status);
    //   }
    //   console.log("res, ", res);
    //   onSuccess(res);
    //   this.previousApiCall = null;
    //   return res;
    // }
    // return []
  }

  //   public getPreviousApiCall(): ApiCall | null {
  //     return this.previousApiCall;
  //   }
}

export type { ApiCall };
