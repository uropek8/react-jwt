import React, { createContext } from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import Auth from "./store/auth";
import client from "./helpers/axios";

interface IAuth {
  authApi: Auth;
}

const authApi = new Auth(client);

export const Context = createContext<IAuth>({
  authApi,
});

ReactDOM.render(
  <Context.Provider value={{ authApi }}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Context.Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
