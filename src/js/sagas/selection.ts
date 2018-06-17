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
  Area,
  isEmpty
} from 'ekkiog-editing';
import { get as getTileAt, set, AreaData } from 'ennea-tree';
import { put, select, take } from 'redux-saga/effects';

import {
  MoveItemAtAction,
  removeTileAt,
  resetEditorMenu,
  saveForest,
  selectItem,
  setForest,
  showOkCancelMenu,
  stopSelection,
  OkCancelAction,
  MoveSelectionAction,
  setOkCancelMenuValid,
} from '../actions';
import { State } from '../reduce';

export default function* selection(item : AreaData<Item>){
  yield put(selectItem(set(createEnneaTree(), item.data, item), item));
  const {isValid} = yield* validate(item.data);
  yield put(showOkCancelMenu(isValid));
  while(true){
    const action : OkCancelAction | MoveSelectionAction = yield take(['okCancel', 'moveSelection']);
    const {isValid, forest} = yield* validate(item.data);
    if(action.type === 'okCancel'){
      yield put(stopSelection());
      yield put(resetEditorMenu());
      if(action.ok && isValid){
        yield put(setForest(forest));
        return true
      }
      return false;
    }else{
      yield put(setOkCancelMenuValid(isValid));
    }
  }
}

function* validate(item : Item){
  const {selection, context: {forest: oldForest}} : State = yield select();
  if(selection.selection == false) return false;
  const x = selection.x + selection.dx;
  const y = selection.y + selection.dy;
  const forest = drawItem(oldForest, item, x, y);
  return {forest, isValid: oldForest !== forest};
}


function drawItem(forest : Forest, item : Item, x : number, y : number) : Forest {
  switch(item.type){
    case WIRE:
      return drawWire(forest, x, y);
    case UNDERPASS:
      return drawUnderpass(forest, x, y);
    case LIGHT:
      return drawLight(forest, x+1, y+1, item.direction);
    case BUTTON:
      return drawButton(forest, x+1, y+1, item.direction);
    case GATE:
      return drawGate(forest, x+3, y+1);
    case COMPONENT:
      return drawComponent(forest, x+(item.package.width>>1), y+(item.package.height>>1), item.package);
    default:
      return forest;
  }
}
