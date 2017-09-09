
export type ToggleEditorMenuAction = {
  type: 'toggleEditorMenu'
}
export const toggleEditorMenu = () : ToggleEditorMenuAction => ({
  type: 'toggleEditorMenu'
});

export type ShowOkCancelMenuAction = {
  readonly type : 'showOkCancelMenu',
  isValid : boolean
}
export const showOkCancelMenu = (isValid = true) : ShowOkCancelMenuAction => ({
  type: 'showOkCancelMenu',
  isValid
});

export type OkCancelAction = {
  readonly type : 'okCancel',
  readonly ok : boolean
}
export const okCancel = (ok : boolean) : OkCancelAction => ({
  type: 'okCancel',
  ok
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
