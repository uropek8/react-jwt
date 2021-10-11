import React, { FC } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
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
          <Route
            path="/signup"
            exact
            render={({ history }) => <AuthCard type="signup" history={history} />}
          ></Route>
          <Route
            path="/login"
            exact
            render={({ history }) => <AuthCard type="login" history={history} />}
          ></Route>
          <Route path="/me" exact render={({ history }) => <Greeting history={history} />}></Route>
        </Switch>
      </main>
    </Router>
  );
};

export default App;
