import { EnneaTree, Direction, Item } from '../editing';

import {
  Action
} from '../actions';

import { update, Box, Pos } from 'ennea-tree';

export interface ItemSelectedState {
  readonly selection: true,
  readonly enneaTree: EnneaTree,
  readonly top: number,
  readonly left: number,
  readonly right: number,
  readonly bottom: number,
  readonly dx: number,
  readonly dy: number,
  readonly x: number,
  readonly y: number
}

export type SelectionState = ItemSelectedState | null;

const initialState: SelectionState = null;

export default function reduce(state = initialState, action: Action): SelectionState {
  switch (action.type) {
    case 'selectItem':
      return {
        enneaTree: action.enneaTree,
        top: (action.area.top | 0),
        left: (action.area.left | 0),
        right: (action.area.left | 0) + (action.area.width | 0),
        bottom: (action.area.top | 0) + (action.area.height | 0),
        dx: 0,
        dy: 0,
        x: action.area.left | 0,
        y: action.area.top | 0,
        selection: true
      };
    case 'moveSelection':
      return state && {
        ...state,
        dx: action.dx,
        dy: action.dy
      };
    case 'setToolDirection':
      return state && {
        ...state,
        enneaTree: rotate(state.enneaTree, action.direction, state)
      };
    case 'stopSelection':
      return null;
    default:
      return state;
  }
}

function rotate(tree: EnneaTree, context: Direction, area: Box): EnneaTree {
  return update(tree, rotateItem).result([{ area, context }]);
}

const rotateItem = (item: Item, direction: Direction, pos: Pos) => {
  switch (item.type) {
    case "button":
    case "light":
      return {
        ...item,
        direction
      };
    default:
      return item;
  }
}
