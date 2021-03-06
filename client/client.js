// Vendor Dependencies
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import 'materialize-css';
import 'materialize-css/bin/materialize.css';

require('es6-promise').polyfill();

// Import App
import App from './components/App';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EventDetails from './pages/EventDetails';
import NewEvent from './pages/NewEvent';

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="dashboard" component={Dashboard} />
      <Route path="login" component={Login} />
      <Route path="signup" component={Signup} />
      <Route path="event">
        <Route path="new" component={NewEvent} />
        <Route path=":uid" component={EventDetails} />
      </Route>
    </Route>
  </Router>
), document.getElementById('app'));
