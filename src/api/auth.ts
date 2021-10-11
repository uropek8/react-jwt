import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { UserRequestBody, UserResponseBody, AuthResponseBody } from "../types/user";

const BASE_URL = "http://142.93.134.108:1111/";

export default class Auth {
  protected readonly instance: AxiosInstance;
  private static instanceAuth: Auth;
  private accessToken: string | null;
  private refreshToken: string | null;
  private refreshRequest: Promise<AxiosResponse<UserResponseBody>> | null;

  constructor(baseURL = BASE_URL) {
    this.instance = axios.create({
      withCredentials: true,
      baseURL,
    });
    this.accessToken = localStorage.getItem("access_token") || null;
    this.refreshToken = localStorage.getItem("refresh_token") || null;
    this.refreshRequest = null;
    this.initInterceptors();
  }

  private initInterceptors = () => {
    this.instance.interceptors.request.use(
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

    this.instance.interceptors.response.use(
      async (res: AxiosResponse) => {
        if (res.data.statusCode === 401) {
          if (!this.refreshRequest) {
            this.refreshRequest = axios
              .create({
                withCredentials: true,
                baseURL: BASE_URL,
                headers: {
                  Authorization: `Bearer ${this.refreshToken}`,
                },
              })
              .post<UserResponseBody>("/refresh");
          }

          const { data } = await this.refreshRequest;

          this.refreshRequest = null;

          this.accessToken = data.body?.access_token;
          this.refreshToken = data.body?.refresh_token;

          if (this.accessToken && this.refreshToken) {
            localStorage.setItem("access_token", this.accessToken);
            localStorage.setItem("refresh_token", this.refreshToken);
          }

          return this.instance(res.config);
        }

        return res;
      },
      (err: AxiosError): Promise<AxiosError> => Promise.reject(err)
    );
  };

  static getInstanceAuth = () => {
    if (!Auth.instanceAuth) {
      Auth.instanceAuth = new Auth();
    }

    return Auth.instanceAuth;
  };

  public async register(body: UserRequestBody) {
    return await this.instance.post<{ message: string }>("/sign_up", body);
  };

  public async login(body: UserRequestBody) {
    const searchParams = new URLSearchParams({ ...body });

    return await this.instance.post<UserResponseBody>(`/login?${searchParams.toString()}`);
  };

  public async me() {
    return await this.instance.get<AuthResponseBody>("/me");
  };

  public logout() {
    this.accessToken = null;
    this.refreshToken = null;

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
}
