import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Navbar from "./components/layouts/Navbar";
import Landing from "./components/layouts/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layouts/Alert";
import "./App.css";

// Combines React and Redux together
import { Provider } from "react-redux";
import store from "./store";
import getTokenFromCookie from "./utils/getTokenFromCookie";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

let token = getTokenFromCookie();
if (token) {
  setAuthToken(token);
} else {
  console.log("No token");
}

const App = () => {
  // * Adding a empty set of brackets make it run only once
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
