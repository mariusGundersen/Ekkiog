import { PopupActions } from "../actions/popup";

export type PopupState =
  NoPopup |
  ShowPopup;

export type PopupData =
  ProfilePopupData |
  GitProgressPopupData;

export interface NoPopup {
  readonly show : false
}

export interface ShowPopup {
  readonly show : true
  readonly data : PopupData
}

export interface ProfilePopupData {
  readonly popup : 'Profile'
}

export interface GitProgressPopupData {
  readonly popup : 'GitProgress'
  readonly message : string
}

const defaultState : PopupState = {
  show: false
};

export default function popup(state = defaultState, action : PopupActions) : PopupState {
  switch(action.type){
    case 'ShowPopup':
      return {
        show: true,
        data: action.popup == 'Profile' ? {
          popup: 'Profile'
        } : {
          popup: 'GitProgress',
          message: ''
        }
      };
    case 'HidePopup':
      return {
        show: false
      };
    case 'PopupProgressMessage':
      return state.show && state.data.popup === 'GitProgress' ? {
        ...state,
        data: {
          ...state.data,
          message: action.message
        }
      } : state;
    default:
      return state;
  }
}