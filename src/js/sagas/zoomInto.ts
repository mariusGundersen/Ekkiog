import { get as getTileAt } from 'ennea-tree';
import { put, select } from 'redux-saga/effects';

import { abortContextLoading, forestLoaded, pushContextLoading, ZoomIntoAction } from '../actions';
import setUrl from '../actions/router';
import { State } from '../reduce';
import { ContextState } from '../reduce/context';
import { loadOrPull } from './loadForest';
import * as storage from '../storage';
import { StaticRouter } from 'react-router';
import { viewportToTile } from '../reduce/perspective';

export default function* zoomInto({x, y} : ZoomIntoAction){
  const { context, view } : State = yield select();

  const areaData = getTileAt(context.forest.enneaTree, y|0, x|0);
  if(!areaData || areaData.data.type !== 'component' || !areaData.data.package.name) return;

  const {repo, name} = locateRepo(areaData.data.package, context);
  const centerX = areaData.left + areaData.width/2;
  const centerY = areaData.top + areaData.height/2;

  const [left, top] = viewportToTile(view.perspective, 0, 0);
  const [right, bottom] = viewportToTile(view.perspective, view.pixelWidth, view.pixelHeight);
  yield put(pushContextLoading(repo, name, {top, left, right, bottom}, centerX, centerY));
  try{
    const forest = yield* loadOrPull(repo, name, areaData.data.package.hash);
    const hash = yield storage.getHash(repo, name);
    yield put(setUrl(repo, name));
    yield put(forestLoaded(forest, forest.hash, repo.length > 0 || hash != forest.hash || context.isReadOnly));
  }catch(e){
    yield put(abortContextLoading());
  }
}

function locateRepo({repo, name} : {repo : string, name : string}, context : ContextState){
  return {
    repo: repo && repo.length > 0 ? repo : context.repo,
    name
  };
}
