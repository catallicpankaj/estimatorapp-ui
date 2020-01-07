import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/:sessionId' component={Dashboard} />
    </Switch>
  </BrowserRouter>
  , document.getElementById('root'));
