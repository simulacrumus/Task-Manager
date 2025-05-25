import type { ApiClient } from "./ApiClient";
import { AxiosApiClient } from "./AxiosApiClient";
const API_URL = import.meta.env.VITE_API_URL;

export const apiClient: ApiClient = new AxiosApiClient(
  API_URL || "http://localhost:5000/api/v1"
);
