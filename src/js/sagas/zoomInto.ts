import { get as getTileAt } from 'ennea-tree';
import { put, select } from 'redux-saga/effects';

import { abortContextLoading, forestLoaded, pushContextLoading, ZoomIntoAction } from '../actions';
import setUrl from '../actions/router';
import { State } from '../reduce';
import { ContextState } from '../reduce/context';
import { loadOrPull } from './loadForest';

export default function* zoomInto({x, y} : ZoomIntoAction){
  const { context, view } : State = yield select();

  const areaData = getTileAt(context.forest.enneaTree, y|0, x|0);
  if(!areaData || areaData.data.type !== 'component' || !areaData.data.name) return;

  const {repo, name} = locateRepo(areaData.data, context);
  const centerX = areaData.left + areaData.width/2;
  const centerY = areaData.top + areaData.height/2;
  const posA = view.viewportToTile(0, 0);
  const posB = view.viewportToTile(view.pixelWidth, view.pixelHeight);
  yield put(pushContextLoading(repo, name, box(posA, posB), centerX, centerY));
  try{
    const forest = yield* loadOrPull(repo, name);
    yield put(setUrl(repo, name));
    yield put(forestLoaded(forest, forest.hash));
  }catch(e){
    yield put(abortContextLoading());
  }
}

function box([left, top] : number[], [right, bottom] : number[]){
  return {top, left, right, bottom};
}

function locateRepo({repo, name} : {repo : string, name : string}, context : ContextState){
  return {
    repo: repo && repo.length > 0 ? repo : context.repo,
    name
  };
}
