import { makeAutoObservable } from "mobx";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

interface RequestBody {
  email: string;
  password: string;
}

interface AuthResponse {
  body: {
    access_token: string;
    refresh_token: string;
  };
  statusCode: string;
}

class Auth {
  isLoading = true;
  client: AxiosInstance;
  accessToken: string | null;
  refreshToken: string | null;
  refreshRequest: Promise<AxiosResponse<AuthResponse>> | null;

  constructor(client: AxiosInstance) {
    makeAutoObservable(this, { client: false });
    this.client = client || axios.create();
    this.accessToken = localStorage.getItem("access_token") || null;
    this.refreshToken = localStorage.getItem("refresh_token") || null;
    this.refreshRequest = null;

    this.client.interceptors.request.use(
      (config: AxiosRequestConfig): AxiosRequestConfig => {
        if (!this.accessToken) {
          return config;
        }

        const newConfig = {
          headers: {},
          ...config,
        };

        newConfig.headers.Authorization = `Bearer ${this.accessToken}`;

        return newConfig;
      },
      (err: AxiosError): Promise<AxiosError> => Promise.reject(err)
    );

    this.client.interceptors.response.use(
      async (res: AxiosResponse) => {
        if (res.data.statusCode === 401) {
          if (!this.refreshRequest) {
            this.refreshRequest = axios
              .create({
                withCredentials: true,
                baseURL: "http://142.93.134.108:1111",
                headers: {
                  Authorization: `Bearer ${this.refreshToken}`,
                },
              })
              .post<AuthResponse>("/refresh");
          }

          const { data } = await this.refreshRequest;

          this.refreshRequest = null;

          this.accessToken = data.body?.access_token;
          this.refreshToken = data.body?.refresh_token;

          localStorage.setItem("access_token", this.accessToken);
          localStorage.setItem("refresh_token", this.refreshToken);

          return this.client(res.config);
        }

        return res;
      },
      (err: AxiosError): Promise<AxiosError> => Promise.reject(err)
    );
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  async register(body: RequestBody) {
    const { data } = await this.client.post<AuthResponse>("/sign_up", body);

    this.accessToken = data.body?.access_token;
    this.refreshToken = data.body?.refresh_token;

    localStorage.setItem("access_token", this.accessToken);
    localStorage.setItem("refresh_token", this.refreshToken);
  }

  async login(body: RequestBody) {
    const searchParams = new URLSearchParams({ ...body });
    const { data } = await this.client.post<AuthResponse>(`/login?${searchParams.toString()}`);

    this.accessToken = data.body?.access_token;
    this.refreshToken = data.body?.refresh_token;

    localStorage.setItem("access_token", this.accessToken);
    localStorage.setItem("refresh_token", this.refreshToken);
  }

  async me() {
    try {
      await this.client("/me");
    } catch (e) {
      console.log("Error on /me ", e);
    } finally {
      this.setIsLoading(false);
    }
  }

  logout() {
    this.accessToken = null;
    this.refreshToken = null;

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
}

export default Auth;
