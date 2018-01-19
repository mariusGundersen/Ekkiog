import { Action } from "../../actions";

export interface GitPopupState {
  readonly message : string
  readonly status : 'busy' | 'success' | 'failure'
}

const defaultState : GitPopupState = {
  message: '',
  status: 'busy'
};

export default function popup(state = defaultState, action : Action) : GitPopupState {
  switch(action.type){
    case 'GitProgressMessage':
      return {
        ...state,
        message: action.message
      };
    case 'GitProgressStatus':
      return {
        ...state,
        status: action.status
      };
    default:
      return state;
  }
}