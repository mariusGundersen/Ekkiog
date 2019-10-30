import { createForest, getTileAt } from '../editing';
import { put, select } from 'redux-saga/effects';

import {
  InsertItemAction,
  resetEditorMenu,
  saveForest,
  stopSelection,
} from '../actions';
import { State } from '../reduce';
import selection from './selection';
import { viewportToTile } from '../reduce/perspective';
import { tap } from '../reduce/forest';

export default function* insertItem({ tool }: InsertItemAction) {
  const { selection: isSelected, view, context, editor }: State = yield select();

  if (isSelected) {
    yield put(stopSelection());
    yield put(resetEditorMenu());
  }

  const [x, y] = viewportToTile(view.perspective, view.pixelWidth / 2, view.pixelHeight / 2).map(Math.floor);

  const forest = tap(createForest(context.forest.buddyTree), tool, editor.toolDirection, x, y);

  const item = getTileAt(forest, x, y);

  const ok = yield* selection(item);
  if (ok) {
    yield put(saveForest(`Inserted ${tool}`));
  }
}
