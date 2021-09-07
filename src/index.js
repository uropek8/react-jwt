import React, { createContext } from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./components/App/App";
import reportWebVitals from "./reportWebVitals";
// import Store from "./store/store";
import JwtApi from "./store/jwt";
import client from "./helpers/axios/index";

// const store = new Store();
const jwtApi = new JwtApi({ client });

export const Context = createContext({
  jwtApi,
});

ReactDOM.render(
  <Context.Provider value={{ jwtApi }}>
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
