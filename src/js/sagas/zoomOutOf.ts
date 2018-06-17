import {
  clear,
  Package,
  COMPONENT,
  Component,
  createForest,
  drawComponent,
  Forest,
  packageComponent,
  getTileAt,
} from 'ekkiog-editing';
import { AreaData, getIterator } from 'ennea-tree';
import { put, select, take } from 'redux-saga/effects';

import {
  popContext,
  removeTileAt,
  saveForest,
  setForest,
  ZoomOutOfAction,
  stopSelection,
  resetEditorMenu,
} from '../actions';
import setUrl from '../actions/router';
import { State } from '../reduce';
import { ContextState } from '../reduce/context';
import selection from './selection';

export default function* zomOutOf({} : ZoomOutOfAction){
  const { context: currentContext, selection: {selection: isSelection}} : State = yield select();

  if(isSelection){
    yield put(stopSelection());
    yield put(resetEditorMenu());
  }

  const outerContext = currentContext.previous;
  if(!outerContext) return;

  const innerContext : ContextState = yield* waitUntilSaved(currentContext);

  yield put(popContext());
  yield put(setUrl(outerContext.repo, outerContext.name));
  if(innerContext.isReadOnly || outerContext.isReadOnly) return;

  const pkg = packageComponent(innerContext.forest, innerContext.repo, innerContext.name, innerContext.hash, innerContext.hash);
  const {forest, didntFit} = replaceComponents(outerContext.forest, pkg);
  if(outerContext.forest !== forest){
    yield put(setForest(forest));
  }

  for(const position of didntFit) {
    yield put(removeTileAt(position.x, position.y));
    const {context: {forest: newForest}} : State = yield select();

    const forest = drawComponent(createForest(newForest.buddyTree), position.x, position.y, pkg);

    const item = getTileAt(forest, position.x, position.y);
    yield* selection(item);
  };

  const { context: newContext } : State = yield select();
  if(outerContext.forest !== newContext.forest){
    yield put(saveForest(`Updated ${pkg.name}`));
  }
}

function* waitUntilSaved(context : ContextState){
  if(context.saving) {
    yield take('forest-saved');
    return (yield select()).context;
  }else{
    return context;
  }
}

function replaceComponents(forest : Forest, newComponent : Package){
  const didntFit = [] as {x : number, y : number}[];
  for(const item of getComponents(forest, newComponent.name)){
    if(item.data.package.hash === newComponent.hash) continue;
    const x = item.left + (item.width>>1);
    const y = item.top + (item.height>>1);
    const clearedForest = clear(forest, x, y);
    const newForest = drawComponent(clearedForest, x, y, newComponent);
    if(newForest === clearedForest){
      didntFit.push({x, y});
    }else{
      forest = newForest;
    }
  }
  return {forest, didntFit};
}

function *getComponents(forest : Forest, name : string) : IterableIterator<AreaData<Component>>{
  const size = forest.enneaTree.size;
  for(const item of getIterator(forest.enneaTree, box([0,0], [size, size]))){
    if(item.data.type === COMPONENT
    && item.data.package.name === name){
      yield {
        ...item,
        data: item.data
      };
    }
  }
}

function box([left, top] : number[], [right, bottom] : number[]){
  return {top, left, right, bottom};
}
