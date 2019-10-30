import {
  createEnneaTree,
  Item,
  LIGHT,
  GATE,
  COMPONENT,
  Forest,
  drawLight,
  BUTTON,
  drawButton,
  drawGate,
  drawComponent,
  WIRE,
  drawWire,
  UNDERPASS,
  drawUnderpass,
  getTileAt
} from '../editing';
import { set, AreaData } from 'ennea-tree';
import { put, select, take } from 'redux-saga/effects';

import {
  resetEditorMenu,
  selectItem,
  setForest,
  showOkCancelMenu,
  stopSelection,
  OkCancelAction,
  MoveSelectionAction,
  setOkCancelMenuValid,
  SetToolDirectionAction,
} from '../actions';
import { State } from '../reduce';

export default function* selection(item: AreaData<Item>) {
  yield put(selectItem(set(createEnneaTree(), item.data, item), item));
  const { isValid } = yield* validate();
  yield put(showOkCancelMenu(isValid));
  while (true) {
    const action: OkCancelAction | MoveSelectionAction | SetToolDirectionAction = yield take(['okCancel', 'moveSelection', 'setToolDirection']);
    const { isValid, forest } = yield* validate();
    switch (action.type) {
      case 'okCancel': {
        yield put(stopSelection());
        yield put(resetEditorMenu());
        if (action.ok && isValid) {
          yield put(setForest(forest));
          return true
        }
        return false;
      }
      default: {
        yield put(setOkCancelMenuValid(isValid));
      }
    }
  }
}

function* validate() {
  const { selection, context: { forest: oldForest } }: State = yield select();
  if (selection === null) return false;

  const { data: item } = getTileAt(selection, selection.left, selection.top);
  const left = selection.left + selection.dx;
  const top = selection.top + selection.dy;
  const forest = drawItem(oldForest, item, left, top);
  return { forest, isValid: oldForest !== forest };
}


function drawItem(forest: Forest, item: Item, x: number, y: number): Forest {
  switch (item.type) {
    case WIRE:
      return drawWire(forest, x, y);
    case UNDERPASS:
      return drawUnderpass(forest, x, y);
    case LIGHT:
      return drawLight(forest, x + 1, y + 1, item.direction);
    case BUTTON:
      return drawButton(forest, x + 1, y + 1, item.direction);
    case GATE:
      return drawGate(forest, x + 3, y + 1);
    case COMPONENT:
      return drawComponent(forest, x + (item.package.width >> 1), y + (item.package.height >> 1), item.package);
    default:
      return forest;
  }
}
