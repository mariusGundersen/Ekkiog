import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'redux';

import { State } from './reduce';

import App from './components/App';
import Demo from './components/Demo';

export default function main(store : Store<State>){
  render(
    <Provider store={store}>
      {
        location.search.startsWith('?demo')
        ? <Demo />
        : <App />
      }
    </Provider>,
    document.querySelector('.react-app')
  )
}