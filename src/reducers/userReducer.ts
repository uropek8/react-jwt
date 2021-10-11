import { UserState, UserAction, UserActionTypes } from "../types/user";

const initState: UserState = {
  isLoading: false,
  message: "Enter your credentials to log in",
  accessToken: null,
  refreshToken: null,
};

const userReducer = (state = initState, action: UserAction): UserState => {
  switch (action.type) {
    case UserActionTypes.IS_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case UserActionTypes.USER_REGISTER:
      return {
        ...state,
        message: action.payload.message,
      };
    case UserActionTypes.USER_LOGIN:
      return {
        ...state,
        message: "You have logged in successfuly",
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    case UserActionTypes.USER_LOGOUT:
      return {
        ...state,
        message: "You have logout in successfuly",
        accessToken: null,
        refreshToken: null,
      };
    case UserActionTypes.USER_ME:
      return {
        ...state,
        isLoading: false,
        message: action.payload.message,
      };

    default:
      return state;
  }
};

export default userReducer;
