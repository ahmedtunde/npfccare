import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "./assets/css/main.css";
import Login from "./components/login";
import NoMatch from "./components/noMatch";
import PagesComponent from "./components/pages";
import { PrivateRoute, ProvideAuth } from "./components/utilities";
import ResetPassword from './components/resetPassword';

const App = () => (
  <ProvideAuth>
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route exact path="/login" component={Login} />
        <Route path={['/resetPassword/:token', '/update_password/:token']} component={ResetPassword} />

        <PrivateRoute path="/pages">
          <PagesComponent />
        </PrivateRoute>
        {/* <Route path='/pages' component={PagesComponent} /> */}
        <Route path="*" component={NoMatch} />
      </Switch>
    </Router>
  </ProvideAuth>
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
