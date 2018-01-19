
export type ShowPopupAction = {
  readonly type : 'ShowPopup'
  readonly popup : 'Profile' | 'GitProgress'
}
export const showPopup = (popup : 'Profile' | 'GitProgress') : ShowPopupAction => ({
  type: 'ShowPopup',
  popup
});

export type HidePopupAction = {
  readonly type : 'HidePopup'
}
export const hidePopup = () : HidePopupAction => ({
  type: 'HidePopup'
});

export type PopupProgressMessage = {
  readonly type : 'PopupProgressMessage'
  readonly message : string
}
export const progressMessage = (message : string) : PopupProgressMessage => ({
  type: 'PopupProgressMessage',
  message
});

export type PopupActions =
  ShowPopupAction |
  HidePopupAction |
  PopupProgressMessage;