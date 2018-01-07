
export type ShowPopupAction = {
  readonly type : 'ShowPopup'
  readonly popup : 'Profile'
}
export const showPopup = (popup : 'Profile') : ShowPopupAction => ({
  type: 'ShowPopup',
  popup
});

export type HidePopupAction = {
  readonly type : 'HidePopup'
}
export const hidePopup = () : HidePopupAction => ({
  type: 'HidePopup'
});

export type PopupActions =
  ShowPopupAction |
  HidePopupAction;