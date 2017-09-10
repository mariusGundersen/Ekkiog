import { BUTTON, createForest, Direction, GATE, LIGHT, Tool } from 'ekkiog-editing';
import { get as getTileAt } from 'ennea-tree';
import { put, select, take } from 'redux-saga/effects';

import {
  draw,
  insertItem,
  resetEditorMenu,
  saveForest,
  selectItem,
  showOkCancelMenu,
  stopSelection,
  TapTileAction,
} from '../actions';
import { State } from '../reduce';
import { ContextState } from '../reduce/context';
import { tap } from '../reduce/forest';
import nextFrame from '../utils/nextFrame';

export default function* tapTile({x, y, tool, direction} : TapTileAction) {
  const {context} : State = yield select();

  const forest = context.forest;
  yield nextFrame();
  const area = getTileAt(forest.enneaTree, y, x);
  if(area && area.data && area.data.type === BUTTON){
    const net = area.data.net;
    //engine.mutateContext(mutator => mutator.toggleGate(net));
  }else{
    yield put(draw(x, y, tool, direction));
    if(tool == BUTTON
    || tool == GATE
    || tool == LIGHT){
      const {context} : State = yield select();

      const mutatedForest = context.forest;
      if(forest === mutatedForest){
        yield* insertMovableItem(context, tool, direction, x, y);
      }
    }
    yield put(saveForest(`Inserted ${tool}`));
  }
}

function* insertMovableItem(context : ContextState, tool : Tool, direction : Direction, x : number, y : number){
  const buddyTree = context.forest.buddyTree;
  const forest = tap(createForest(buddyTree), tool, direction, x, y);
  const item = getTileAt(forest.enneaTree, y, x);
  yield put(selectItem(forest, item));
  yield put(showOkCancelMenu(false));
  const {ok} = yield take('okCancel');
  if(ok) {
    const {selection} : State = yield select();
    if(selection.selection == false) return;
    yield put(draw(x + selection.dx, y + selection.dy, tool, direction));
    yield put(stopSelection());
    yield put(resetEditorMenu());
  } else {
    yield put(stopSelection());
    yield put(resetEditorMenu());
  }
};
