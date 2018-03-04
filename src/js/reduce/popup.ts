import { PopupActions } from "../actions/popup";

export type PopupState =
  NoPopup |
  ShowPopup;

export interface NoPopup {
  readonly show : false
}

export interface ShowPopup {
  readonly show : 'Profile' | 'GitProgress' | 'Sync' | 'Share'
}

const defaultState : PopupState = {
  show: false
};

export default function popup(state = defaultState, action : PopupActions) : PopupState {
  switch(action.type){
    case 'ShowPopup':
      return {
        show: action.popup
      };
    case 'HidePopup':
      return {
        show: false
      };
    default:
      return state;
  }
}