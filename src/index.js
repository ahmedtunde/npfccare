import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import './assets/css/main.css';
import Login from './components/login';
import NoMatch from './components/noMatch';
import PagesComponent from './components/pages';
import { PrivateRoute, ProvideAuth } from './components/utilities';

const App = () => (
  <ProvideAuth>
    <Router>
      <Switch>
        <Route exact path={['/', '/login']} component={Login} />
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
  document.getElementById('root')
);
