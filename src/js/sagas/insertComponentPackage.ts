import { CompiledComponent, createForest, drawComponent, IHavePosition, isEmpty } from 'ekkiog-editing';
import { put, select, take } from 'redux-saga/effects';

import {
  insertComponent,
  InsertComponentPackageAction,
  resetEditorMenu,
  saveForest,
  selectItem,
  showOkCancelMenu,
  stopSelection,
} from '../actions';
import { State } from '../reduce';
import { ContextState } from '../reduce/context';

export default function* insertComponentPackage({componentPackage} : InsertComponentPackageAction){
  const state : State = yield select();

  if(state.selection.selection){
    yield put(stopSelection());
    yield put(resetEditorMenu());
  }

  const tile = state.view.viewportToTile(state.view.pixelWidth/2, state.view.pixelHeight/2);
  const centerTile = {
    x: tile[0]|0,
    y: tile[1]|0
  };
  const top = centerTile.y - (componentPackage.height>>1);
  const left = centerTile.x - (componentPackage.width>>1);
  const right = centerTile.x - (componentPackage.width>>1) + componentPackage.width;
  const bottom = centerTile.y - (componentPackage.height>>1) + componentPackage.height;

  const isValid = isEmpty(state.context.forest.enneaTree, top, left, right, bottom);
  yield put(showOkCancelMenu(isValid));
  yield put(selectComponent(state.context, componentPackage, centerTile));
  const {ok} = yield take('okCancel');
  if(ok){
    const {selection} : State = yield select();
    if(selection.selection == false) return;
    yield put(insertComponent(componentPackage, {
      x: selection.x + selection.dx,
      y: selection.y + selection.dy
    }));
    yield put(saveForest(`Inserted ${componentPackage.name}`));
    yield put(stopSelection());
    yield put(resetEditorMenu());
  } else {
    yield put(stopSelection());
    yield put(resetEditorMenu());
  }
}

const selectComponent = (context : ContextState, component : CompiledComponent, position : IHavePosition) => {
  const buddyTree = context.forest.buddyTree;
  const forest = drawComponent(createForest(buddyTree), position.x|0, position.y|0, component);
  return selectItem(forest.enneaTree,
    {
      top : (position.y|0) - (component.height>>1),
      left: (position.x|0) - (component.width>>1),
      width: component.width|0,
      height: component.height|0
    }
  );
}
