import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();

class HTTPClient {
  instance: AxiosInstance | null | undefined;
  baseUrl: string | null | undefined;

  constructor() {
    if (!this.baseUrl) {
      this.setBaseURL();
    }
    if (!this.instance) {
      this.instantiateAxiosInstance();
    }
  }

  instantiateAxiosInstance() {
    this.instance = axios.create({
      timeout: 180000,
    });

    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = cookies.get("token");
        if (token) {
          config.headers.Authorization = token;
          config.headers.set("x-jwt-token", token);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        if (response.data?.token?.access_token) {
          const token = response.data.token.access_token;

          cookies.set("token", token, {
            maxAge: 3600,
            sameSite: "lax",
            path: "/",
          });
          delete response.data.token.access_token;
        }
        if (response.data?.token?.refresh_token) {
          const refreshToken = response.data.token.refresh_token;

          cookies.set("refresh_token", refreshToken, {
            maxAge: 3600,
            sameSite: "lax",
            path: "/",
          });
          delete response.data.token.refresh_token;
        }
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  setBaseURL() {
    const url = window.location.origin;
    this.baseUrl = url;
  }

  Get(url: string, params: any = undefined, abortController?: AbortController) {
    if (abortController) {
      return this.instance?.get(`${this.baseUrl}/api/${url}`, {
        headers: {
          "Content-Type": "application/json",
        },
        params: params,
        signal: abortController.signal,
      });
    } else {
      return this.instance?.get(`${this.baseUrl}/api/${url}`, {
        headers: {
          "Content-Type": "application/json",
        },
        params: params,
      });
    }
  }

  Post(
    url: string,
    payload: any = undefined,
    urlParams: any = undefined,
    abortController?: AbortController
  ) {
    if (abortController) {
      return this.instance?.post(`${this.baseUrl}/api/${url}`, payload, {
        params: urlParams ?? {},
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortController.signal,
      });
    } else {
      return this.instance?.post(`${this.baseUrl}/api/${url}`, payload, {
        params: urlParams ?? {},
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  Put(
    url: string,
    payload: any = undefined,
    abortController?: AbortController
  ) {
    if (abortController) {
      return this.instance?.put(`${this.baseUrl}/api/${url}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortController.signal,
      });
    } else {
      return this.instance?.put(`${this.baseUrl}/api/${url}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  Delete(
    url: string,
    payload: any = undefined,
    abortController?: AbortController
  ) {
    if (abortController) {
      return this.instance?.delete(`${this.baseUrl}/api/${url}`, {
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortController.signal,
      });
    } else {
      return this.instance?.delete(`${this.baseUrl}/api/${url}`, {
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }
}

const httpClient = new HTTPClient();
export default httpClient;
