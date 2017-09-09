import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'redux';

import { State } from './reduce';

import App from './components/App';

export default function main(store : Store<State>){
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.querySelector('.react-app')
  );
}