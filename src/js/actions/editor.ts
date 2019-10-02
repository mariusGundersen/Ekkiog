import {
  Tool,
  Direction
} from '../editing';

export type SetSelectedToolAction = {
  readonly type : 'setSelectedTool',
  readonly tool : Tool
}
export const setSelectedTool = (tool : Tool) : SetSelectedToolAction => ({
  type: 'setSelectedTool',
  tool
});

export type SetToolDirectionAction = {
  readonly type : 'setToolDirection',
  readonly direction : Direction
}
export const setToolDirection = (direction : Direction) : SetToolDirectionAction => ({
  type: 'setToolDirection',
  direction
});

export type EditorActions =
  SetSelectedToolAction |
  SetToolDirectionAction;
