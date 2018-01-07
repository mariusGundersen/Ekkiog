import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { ConnectedRouter } from 'react-router-redux';
import { Switch, Route } from 'react-router';
import { History } from 'history';

import { State } from './reduce';

import App from './pages/App';
import Login from './pages/Login';

export default function main(store : Store<State>, history : History){
  render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/github/callback" render={() => <Login user={window.__PRELOADED_STATE__ as OauthData} />} />
          <Route path="/" component={App} />
        </Switch>
      </ConnectedRouter>
    </Provider>,
    document.querySelector('.react-app')
  );
}