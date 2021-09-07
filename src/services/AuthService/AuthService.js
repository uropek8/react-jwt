import client from "../../helpers/http/index";

export default class AuthService {
  static async login(email, password) {
    const searchParams = new URLSearchParams({ email, password });
    return client.post(`/login?${searchParams.toString()}`);

    // localStorage.setItem("access_token", data.body?.access_token);
    // localStorage.setItem("refresh_token", this.refreshToken);
  }

  static async register(email, password) {
    const { data } = await client.post("/sign_up", { email, password });

    return data;
  }

  static async me() {
    const { data } = await client("/me");

    return data;
  }

  static async refresh() {
    const { data } = await client.post("/refresh");

    return data;
  }
}
