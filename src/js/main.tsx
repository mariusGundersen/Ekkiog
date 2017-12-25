import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { ConnectedRouter } from 'react-router-redux';
import { History } from 'history';

import { State } from './reduce';

import App from './components/App';

export default function main(store : Store<State>, history : History){
  render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>,
    document.querySelector('.react-app')
  );
}