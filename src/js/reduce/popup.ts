import { PopupActions } from "../actions/popup";


export type PopupState = NoPopup | ShowPopup;
export interface NoPopup {
  readonly show : false
}

export interface ShowPopup {
  readonly show : true
  readonly popup : 'Profile'
}

const defaultState : PopupState = {
  show: false
};

export default function popup(state = defaultState, action : PopupActions){
  switch(action.type){
    case 'ShowPopup':
      return {
        show: true,
        popup: action.popup
      };
    case 'HidePopup':
      return {
        show: false
      };
    default:
      return state;
  }
}