import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router';
import { History } from 'history';
import ErrorBoundary from 'react-error-boundary';

import { State } from './reduce';

const Sandbox = async(() => import(/* webpackChunkName: "sandbox" */ './pages/Sandbox'), {});
const Login = async(() => import(/* webpackChunkName: "login" */ './pages/Login'), { user: window.__PRELOADED_STATE__ as OauthData });
const App = async<any>(() => import(/* webpackChunkName: "app" */ './pages/App') as any, {});

export default function main(store: Store<State>, history: History) {
  render(
    <ErrorBoundary>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/github/callback" render={Login} />
            <Route path="/sandbox" render={Sandbox} />
            <Route path="/" render={App} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    </ErrorBoundary>,
    document.querySelector('.react-app')
  );
}

function async<P>(load: () => Promise<{ default: React.ComponentClass<P> }>, props: P) {
  return () => <Async load={load} props={props} />;
}

class Async<P> extends React.Component<{
  load(): Promise<{ default: React.ComponentClass<P> }>,
  props: P
}, {
  component: null | React.ComponentClass<P>
}> {
  state = {
    component: null as (null | React.ComponentClass<P>)
  }
  componentDidMount() {
    this.props.load()
      .then(component => {
        this.setState({
          component: component.default
        })
      })
  }
  render() {
    const Component = this.state.component;
    return Component == null ? null : <Component {...this.props.props} />
  }
}
