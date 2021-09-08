import axios from "axios";

const API_URL = "https://142.93.134.108:1111";

const client = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

export default client;
