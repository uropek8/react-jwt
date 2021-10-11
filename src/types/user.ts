export interface UserRequestBody {
  email: string;
  password: string;
}

export interface UserResponseBody {
  body: {
    access_token: string;
    refresh_token: string;
  };
  statusCode: number;
}

export interface AuthResponseBody {
  body: {
    message: string;
    status: string;
  };
  statusCode: number;
}

export interface UserState {
  isLoading: boolean;
  message: string;
  accessToken: string | null;
  refreshToken: string | null;
}

interface LoginAction {
  type: UserActionTypes.USER_LOGIN;
  payload: {
    accessToken: string;
    refreshToken: string;
  };
}

interface LogoutAction {
  type: UserActionTypes.USER_LOGOUT;
  payload: {
    accessToken: null;
    refreshToken: null;
  };
}

interface RegisterAction {
  type: UserActionTypes.USER_REGISTER;
  payload: {
    message: string;
  };
}

interface MeAction {
  type: UserActionTypes.USER_ME;
  payload: {
    message: string;
  };
}

interface LoadingAction {
  type: UserActionTypes.IS_LOADING;
}

export type UserAction = LoginAction | LogoutAction | RegisterAction | MeAction | LoadingAction;

export enum UserActionTypes {
  USER_LOGIN = "USER_LOGIN",
  USER_LOGOUT = "USER_LOGOUT",
  USER_REGISTER = "USER_REGISTER",
  USER_ME = "USER_ME",
  IS_LOADING = "IS_LOADING",
}
