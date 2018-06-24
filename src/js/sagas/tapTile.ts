import { BUTTON, createForest, Direction, GATE, LIGHT, Tool, Forest, getTileAt } from 'ekkiog-editing';
import { put, select } from 'redux-saga/effects';

import {
  draw,
  saveForest,
  TapTileAction,
  toggleButton,
} from '../actions';
import { State } from '../reduce';
import { tap } from '../reduce/forest';
import nextFrame from '../utils/nextFrame';
import selection from './selection';

export default function* tapTile({x, y} : TapTileAction) {
  const tx = Math.floor(x);
  const ty = Math.floor(y);

  if(tx < 0 || ty < 0 || tx > 128 || ty > 128) return;

  const {context: {forest, isReadOnly}, editor: {selectedTool, toolDirection}} : State = yield select();

  yield nextFrame();
  const area = getTileAt(forest, tx, ty);
  if(area && area.data && area.data.type === BUTTON){
    const net = area.data.net;
    yield put(toggleButton(net));
  }else{
    if(isReadOnly) return;
    yield put(draw(tx, ty, selectedTool, toolDirection));

    const {context: {forest: mutatedForest}} : State = yield select();
    if(forest === mutatedForest){
      if(selectedTool == BUTTON
      || selectedTool == GATE
      || selectedTool == LIGHT){
        yield* insertMovableItem(mutatedForest, selectedTool, toolDirection, tx, ty);
      }
    }else{
      yield put(saveForest(`Inserted ${selectedTool}`));
    }
  }
}

function* insertMovableItem(initialForest : Forest, tool : Tool, direction : Direction, x : number, y : number){
  const forest = tap(createForest(initialForest.buddyTree), tool, direction, x, y);
  const item = getTileAt(forest, x, y);

  const ok = yield* selection(item);
  if(ok){
    yield put(saveForest(`Inserted ${tool}`));
  }
};
