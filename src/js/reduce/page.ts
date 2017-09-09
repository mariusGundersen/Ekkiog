import {
  Action
} from '../actions';

export interface PageState {
  readonly name : string
}

const initialState : PageState = {
  name: 'loading'
};

export default function view(state = initialState, action : Action) : PageState {
  switch(action.type){
    default:
      return state;
  }
}