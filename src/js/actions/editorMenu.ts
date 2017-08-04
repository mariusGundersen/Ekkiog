
export type ToggleEditorMenuAction = {
  type: 'toggleEditorMenu'
}
export const toggleEditorMenu = () : ToggleEditorMenuAction => ({
  type: 'toggleEditorMenu'
});

export type ShowOkCancelMenuAction = {
  readonly type : 'showOkCancelMenu',
  okAction() : void,
  cancelAction() : void,
  isValid : boolean
}
export const showOkCancelMenu = (okAction : () => void, cancelAction : () => void, isValid = true) : ShowOkCancelMenuAction => ({
  type: 'showOkCancelMenu',
  okAction,
  cancelAction,
  isValid
});

export type SetOkCancelMenuValidAction = {
  readonly type : 'setOkCancelMenuValid',
  readonly isValid : boolean
}
export const setOkCancelMenuValid = (isValid : boolean) : SetOkCancelMenuValidAction => ({
  type: 'setOkCancelMenuValid',
  isValid
});

export type ResetEditorMenuAction = {
  type  : 'resetEditorMenu'
}
export const resetEditorMenu = () => ({
  type: 'resetEditorMenu'
});

export type EditorMenuActions =
  ToggleEditorMenuAction |
  ShowOkCancelMenuAction |
  SetOkCancelMenuValidAction |
  ResetEditorMenuAction;
