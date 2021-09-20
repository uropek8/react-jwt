import React, { FC } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { observer } from "mobx-react-lite";
import AuthCard from "./AuthCard";
import Greeting from "./Greetting";

const App: FC = () => {
  return (
    <Router>
      <main className="min-h-screen flex flex-col items-center justify-center bg-blue-100">
        <Switch>
          <Route path="/" exact>
            <Redirect to="/me" />
          </Route>
          <Route path="/signup">
            <AuthCard type="signup" />
          </Route>
          <Route path="/login">
            <AuthCard type="login" />
          </Route>
          <Route path="/me">
            {localStorage.getItem("access_token") ? <Greeting /> : <Redirect to="/login" />}
          </Route>
        </Switch>
      </main>
    </Router>
  );
};

export default observer(App);
