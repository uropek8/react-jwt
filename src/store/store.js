import { makeAutoObservable } from "mobx";
import axios from "axios";
import AuthService from "../services/AuthService/AuthService";

export default class Store {
  user = {};
  isLogined = false;
  isLoading = true;

  constructor() {
    makeAutoObservable(this);
  }
  
  setUser(user) {
    this.user = user;
  }

  setIsLogined(bool) {
    this.isLogined = bool;
  }

  setIsLoading(bool) {
    this.isLoading = bool;
  }

  async login(email, password) {
    try {
      const { data } = await AuthService.login(email, password);
      console.log(data);
      localStorage.setItem("access_token", data.body?.access_token);
      localStorage.setItem("refresh_token", data.body?.refresh_token);
      this.setIsLogined(true);
      this.setUser(data.body);
    } catch (error) {
      console.log("login error: ", error);
    }
  }

  async register(email, password) {
    try {
      const { data } = await AuthService.register(email, password);
      localStorage.setItem("access_token", data.body?.access_token);
      this.setIsLogined(true);
      this.setUser(data.body);
    } catch (error) {
      console.log("register error: ", error);
    }
  }

  async me() {
    try {
      await AuthService.me();
    } catch (error) {
      console.log("Home error: ", error);
    } finally {
      this.setIsLoading(false);
    }
  }

  async checkAuth() {
    try {
      await AuthService.me();
      this.setIsLogined(true);
    } catch (error) {
      console.log("checkAuth error: ", error);
    } finally {
      this.setIsLoading(false);
    }
  }
}
