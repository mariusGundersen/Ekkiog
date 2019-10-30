import {
  EnneaTree,
  Area,
  Direction
} from '../editing';

export type SelectItemAction = {
  readonly type: 'selectItem',
  readonly enneaTree: EnneaTree,
  readonly area: Area
}
export const selectItem = (enneaTree: EnneaTree, area: Area): SelectItemAction => ({
  type: 'selectItem',
  enneaTree,
  area
});

export type MoveSelectionAction = {
  readonly type: 'moveSelection',
  readonly dx: number,
  readonly dy: number
}
export const moveSelection = (dx: number, dy: number): MoveSelectionAction => ({
  type: 'moveSelection',
  dx,
  dy
});

export type StopSelectionAction = {
  readonly type: 'stopSelection'
}
export const stopSelection = (): StopSelectionAction => ({
  type: 'stopSelection'
});

export type SelectionActions =
  SelectItemAction |
  MoveSelectionAction |
  StopSelectionAction;
