import type { ApiClient } from "./ApiClient";
import axios from "axios";
import type { AxiosInstance } from "axios";

const ISO_DATE_FORMAT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{6})?Z$/;

const parseWithDates = (jsonString: string) => {
  return JSON.parse(jsonString, (_, value) => {
    if (typeof value === "string" && ISO_DATE_FORMAT.test(value)) {
      return new Date(value);
    }
    return value;
  });
};

export class AxiosApiClient implements ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: [
        (data) => {
          if (typeof data === "string") {
            try {
              return parseWithDates(data);
            } catch (e) {
              return data;
            }
          }
          return data;
        },
      ],
    });

    // this.client.interceptors.request.use(
    //   (config) => {
    //     console.log("Request URL: ", `${config.baseURL}${config.url}`);
    //     console.log("Request Params: ", config.params);
    //     console.log("Request Body: ", config.data);
    //     return config;
    //   },
    //   (error) => {
    //     return Promise.reject(error);
    //   }
    // );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          if (error.response.status === 401) {
            console.error("Authentication required");
          } else if (error.response.status === 403) {
            console.error("Access forbidden");
          } else if (error.response.status === 404) {
            console.error("Resource not found");
          } else if (error.response.status === 500) {
            console.error("Server error");
          }
        } else if (error.request) {
          console.error("No response received from server");
        } else {
          console.error("Error setting up request:", error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: Record<string, string>): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    params?: Record<string, string>
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, { params });
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    params?: Record<string, string>
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, { params });
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    params?: Record<string, string>
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, { params });
    return response.data;
  }

  async delete<T>(url: string, params?: Record<string, string>): Promise<T> {
    const response = await this.client.delete<T>(url, { params });
    return response.data;
  }
}
