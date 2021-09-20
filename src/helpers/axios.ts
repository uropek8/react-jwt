import axios, { AxiosInstance } from "axios";

const API_URL = "http://142.93.134.108:1111";

const client: AxiosInstance = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

export default client;
