import { createForest, drawComponent, isEmpty, getTileAt } from '../editing';
import { put, select } from 'redux-saga/effects';

import {
  InsertComponentPackageAction,
  resetEditorMenu,
  saveForest,
  stopSelection,
} from '../actions';
import { State } from '../reduce';
import selection from './selection';
import { viewportToTile } from '../reduce/perspective';

export default function* insertComponentPackage({componentPackage} : InsertComponentPackageAction){
  const {selection: {selection: isSelected}, view, context} : State = yield select();

  if(isSelected){
    yield put(stopSelection());
    yield put(resetEditorMenu());
  }

  const [x, y] = viewportToTile(view.perspective, view.pixelWidth/2, view.pixelHeight/2).map(Math.floor);

  const forest = drawComponent(createForest(context.forest.buddyTree), x, y, componentPackage);

  const item = getTileAt(forest, x, y);

  const ok = yield* selection(item);
  if(ok){
    yield put(saveForest(`Inserted ${componentPackage.name}`));
  }
}
