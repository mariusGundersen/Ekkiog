import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { State } from '../reduce';
import Edit from './Edit';
import Demo from './Demo';

export default () => (
  <Switch>
    <Route path="/demo" component={Demo} />
    <Route path="/" component={Edit} />
  </Switch>
);