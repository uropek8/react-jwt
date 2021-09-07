import axios from "axios";

const API_URL = "http://142.93.134.108:1111";

const client = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

const refreshClient = axios.create({
  withCredentials: true,
  baseURL: API_URL,
  headers: { Authorization: `Bearer ${localStorage.getItem("refresh_token")}` },
});

client.interceptors.request.use(
  (config) => {
    if (!localStorage.getItem("access_token")) {
      return config;
    }

    const newConfig = {
      headers: {},
      ...config,
    };

    newConfig.headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`;

    return newConfig;
  },
  (err) => Promise.reject(err)
);

client.interceptors.response.use(
  async (res) => {
    if (res.data.statusCode === 401) {
      const { data } = await refreshClient.post("/refresh");

      localStorage.setItem("access_token", data.body?.access_token);
      localStorage.setItem("refresh_token", data.body?.refresh_token);
    }

    return res;
  },
  async (err) => {
    console.log("error, ", err.response);
    if (!localStorage.getItem("refresh_token") || err.response.status !== 401 || err.config.retry) {
      return Promise.reject(err);
    }

    const { data } = await refreshClient.post("/refresh");

    localStorage.setItem("access_token", data.body?.access_token);
    localStorage.setItem("refresh_token", data.body?.refresh_token);

    const newRequest = {
      ...err.config,
      retry: true,
    };

    return client(newRequest);
  }
);

export default client;
