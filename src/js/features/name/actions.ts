export interface ShowSetNamePopupAction {
  readonly type : 'ShowSetNamePopup'
  readonly x : number
  readonly y : number
}
export const showSetNamePopup = (x : number, y : number) : ShowSetNamePopupAction => ({
  type: 'ShowSetNamePopup',
  x,
  y
});

export interface InitialSetNameAction {
  readonly type : 'InitialSetName'
  readonly name : string
}
export const initalSetName = (name : string) : InitialSetNameAction => ({
  type: 'InitialSetName',
  name
});

export interface SetNameDoneAction {
  readonly type : 'SetNameDone'
  readonly name : string
}
export const setNameDone = (name : string) : SetNameDoneAction => ({
  type: 'SetNameDone',
  name
});

export type NameActions =
  ShowSetNamePopupAction |
  InitialSetNameAction |
  SetNameDoneAction;