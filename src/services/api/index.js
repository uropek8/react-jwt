import axios from "axios";

export default class Api {
  constructor(options = {}) {
    this.client = options.client || axios.create();
    this.token = options.token;
    this.refreshToken = options.refreshToken;
    this.refreshRequest = null;

    this.client.interceptors.request.use(
      (config) => {
        if (!this.token) {
          return config;
        }

        const newConfig = {
          headers: {},
          ...config,
        };

        newConfig.headers.Authorization = `Bearer ${this.token}`;

        return newConfig;
      },
      (err) => Promise.reject(err)
    );

    this.client.interceptors.response.use(
      (res) => {
        return res;
      },
      async (err) => {
        if (!this.refreshToken || err.response.status !== 401 || err.config.replay) {
          return Promise.reject(err);
        }

        if (!this.refreshRequest) {
          this.refreshRequest = this.client.post("/refresh", { refreshToken: this.refreshToken });
        }
        const { data } = await this.refreshRequest;

        this.token = data.token;
        this.refreshToken = data.refreshToken;

        const newRequest = {
          ...err.config,
          replay: true,
        };

        return this.client(newRequest);
      }
    );
  }

  async register({ email, password }) {
    const { data } = await this.client.post("/sign_up", { email, password });

    this.token = data.token;
    this.refreshToken = data.refreshToken;
  }

  async login({ email, password }) {
    const { data } = await this.client.post("/login", { email, password });

    this.token = data.token;
    this.refreshToken = data.refreshToken;
  }

  me() {
    return this.client("/me").then(({ data }) => data);
  }

  logout() {
    this.token = null;
    this.refreshToken = null;
  }

  getUsers() {
    return this.client("/users").then(({ data }) => data);
  }
}
