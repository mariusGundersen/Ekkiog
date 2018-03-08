
export type ShowPopupAction = {
  readonly type : 'ShowPopup'
  readonly popup : 'Profile' | 'GitProgress' | 'Sync' | 'Share' | 'SetName'
}
export const showPopup = (popup : 'Profile' | 'GitProgress' | 'Sync' | 'Share' | 'SetName') : ShowPopupAction => ({
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