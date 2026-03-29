import axios from "axios";
import { ENV } from "./env";

export const axiosInstance = axios.create({
  baseURL: ENV.BACKEND_URI,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
