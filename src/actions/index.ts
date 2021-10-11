import { Dispatch } from "redux";
import Auth from "../api/auth";
import { UserAction, UserActionTypes } from "../types/user";

const authApi = Auth.getInstanceAuth();

export const registerAction = (email: string, password: string) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      const { data } = await authApi.register({ email, password });

      dispatch({
        type: UserActionTypes.USER_REGISTER,
        payload: {
          message: data.message,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };
};

export const loginAction = (email: string, password: string) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      const { data } = await authApi.login({ email, password });

      localStorage.setItem("access_token", data.body.access_token);
      localStorage.setItem("refresh_token", data.body.refresh_token);

      dispatch({
        type: UserActionTypes.USER_LOGIN,
        payload: {
          accessToken: data.body.access_token,
          refreshToken: data.body.refresh_token,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };
};

export const logoutAction = () => {
  return (dispatch: Dispatch<UserAction>) => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      dispatch({
        type: UserActionTypes.USER_LOGOUT,
        payload: {
          accessToken: null,
          refreshToken: null,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };
};

export const meAction = () => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      dispatch({
        type: UserActionTypes.IS_LOADING,
      });

      const { data } = await authApi.me();

      dispatch({
        type: UserActionTypes.USER_ME,
        payload: {
          message: data.body?.message,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };
};
