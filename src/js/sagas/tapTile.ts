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

export default function* tapTile({x, y, tool, direction} : TapTileAction) {
  const {context: {forest, isReadOnly}} : State = yield select();

  yield nextFrame();
  const area = getTileAt(forest, x, y);
  if(area && area.data && area.data.type === BUTTON){
    const net = area.data.net;
    yield put(toggleButton(net));
  }else{
    if(isReadOnly) return;
    yield put(draw(x, y, tool, direction));

    const {context: {forest: mutatedForest}} : State = yield select();
    if(forest === mutatedForest){
      if(tool == BUTTON
      || tool == GATE
      || tool == LIGHT){
        yield* insertMovableItem(mutatedForest, tool, direction, x, y);
      }
    }else{
      yield put(saveForest(`Inserted ${tool}`));
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
