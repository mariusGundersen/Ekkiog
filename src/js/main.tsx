import * as React from 'react';
import * as reactDom from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'redux';

import { State } from './reduce';

import App from './components/App';

export default function main(store : Store<State>){
  reactDom.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.querySelector('.react-app')
  )
}