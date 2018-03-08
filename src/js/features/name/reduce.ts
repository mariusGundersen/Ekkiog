import { Action } from "../../actions";

export interface SetNameState {
  readonly name : string
}

const defaultState : SetNameState = {
  name: ''
};

export default function setName(state = defaultState, action : Action) : SetNameState {
  switch(action.type){
    case 'InitialSetName':
      return {
        ...state,
        name: action.name
      };
    default:
      return state;
  }
}