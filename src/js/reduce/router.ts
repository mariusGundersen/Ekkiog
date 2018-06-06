import { routerReducer, RouterState as ReactRouterState } from 'react-router-redux';
import { matchPath } from 'react-router';

export interface RouterState extends ReactRouterState {
}

export default function router(state : RouterState | undefined, action : any) : RouterState {
  return routerReducer(state, action);
}