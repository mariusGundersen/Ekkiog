import { routerReducer, RouterState as ReactRouterState } from 'react-router-redux';
import { matchPath } from 'react-router';

export interface RouterState extends ReactRouterState {
  readonly isReadOnly : boolean
}

export default function router(state : RouterState, action : any) : RouterState {
  const nextState = routerReducer(state, action);
  if(nextState === state) return state;

  if(!nextState.location){
    return {
      ...nextState,
      isReadOnly: true
    };
  }

  const match = matchPath(nextState.location.pathname, { path: '/demo' });
  return {
    ...nextState,
    isReadOnly: match ? true : false
  };
}