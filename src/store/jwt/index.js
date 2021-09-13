import { makeAutoObservable } from "mobx";
import axios from "axios";

class JwtApi {
  isLoading = true;

  constructor(options = {}) {
    makeAutoObservable(this);
    this.client = options.client || axios.create();
    this.access_token = options.access_token || localStorage.getItem("access_token");
    this.refresh_token = options.refresh_token || localStorage.getItem("refresh_token");
    this.refreshRequest = null || localStorage.getItem("refreshRequest");

    this.client.interceptors.request.use(
      (config) => {
        if (!this.access_token) {
          return config;
        }

        const newConfig = {
          headers: {},
          ...config,
        };

        newConfig.headers.Authorization = `Bearer ${this.access_token}`;

        return newConfig;
      },
      (err) => Promise.reject(err)
    );

    this.client.interceptors.response.use(
      async (res) => {
        if (res.data.statusCode === 401 && !res.config.retry) {
          if (!this.refreshRequest) {
            this.refreshRequest = axios
              .create({
                withCredentials: true,
                baseURL: "http://142.93.134.108:1111",
                headers: {
                  Authorization: `Bearer ${this.refresh_token}`,
                },
              })
              .post("/refresh");
          }

          const { data } = await this.refreshRequest;

          this.refreshRequest = null;

          this.access_token = data.body?.access_token;
          this.refresh_token = data.body?.refresh_token;

          localStorage.setItem("access_token", this.access_token);
          localStorage.setItem("refresh_token", this.refresh_token);

          const newRequest = {
            ...res.config,
            retry: true,
          };

          return this.client(newRequest);
        }

        return res;
      },
      async (err) => {
        if (!this.refresh_token || err.response.status !== 401 || err.config.retry) {
          return Promise.reject(err);
        }

        if (!this.refreshRequest) {
          this.refreshRequest = this.client.post("/refresh", {
            headers: {
              Authorization: `Bearer ${this.refresh_token}`,
            },
          });
        }

        const { data } = await this.refreshRequest;

        this.refreshRequest = null;

        this.access_token = data.body?.access_token;
        this.refresh_token = data.body?.refresh_token;

        localStorage.setItem("access_token", this.access_token);
        localStorage.setItem("refresh_token", this.refresh_token);

        const newRequest = {
          ...err.config,
          retry: true,
        };

        return this.client(newRequest);
      }
    );
  }

  setIsLoading(bool) {
    this.isLoading = bool;
  }

  async register({ email, password }) {
    const { data } = await this.client.post("/sign_up", { email, password });

    this.access_token = data.body?.access_token;
    this.refresh_token = data.body?.refresh_token;
  }

  async login({ email, password }) {
    const searchParams = new URLSearchParams({ email, password });
    const { data } = await this.client.post(`/login?${searchParams.toString()}`);

    this.access_token = data.body?.access_token;
    this.refresh_token = data.body?.refresh_token;

    localStorage.setItem("access_token", this.access_token);
    localStorage.setItem("refresh_token", this.refresh_token);
  }

  async me() {
    try {
      await this.client("/me");
    } catch (e) {
      console.log(e);
    } finally {
      this.setIsLoading(false);
    }
  }

  logout() {
    this.access_token = null;
    this.refresh_token = null;

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  getUsers() {
    return this.client("/users").then(({ data }) => data);
  }
}

export default JwtApi;
