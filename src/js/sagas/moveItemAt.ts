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
  drawUnderpass
} from 'ekkiog-editing';
import { get as getTileAt, set } from 'ennea-tree';
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
} from '../actions';
import { State } from '../reduce';

export default function* moveItemAt({tx, ty} : MoveItemAtAction){
  const {context: {forest: initialForest}} : State = yield select();

  const item = getTileAt(initialForest.enneaTree, ty, tx);
  yield put(removeTileAt(tx, ty));
  yield put(selectItem(set(createEnneaTree(), item.data, item), item));

  yield put(showOkCancelMenu(true));
  const {ok} = yield take('okCancel');
  if(ok) {
    const {selection, context: {forest}} : State = yield select();
    if(selection.selection == false) return;
    const x = selection.x + selection.dx;
    const y = selection.y + selection.dy;
    yield put(setForest(drawItem(forest, item.data, x, y)));
    yield put(saveForest(`Moved ${item.data.type}`));
    yield put(stopSelection());
    yield put(resetEditorMenu());
  } else {
    yield put(setForest(initialForest));
    yield put(stopSelection());
    yield put(resetEditorMenu());
  }
};

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
