import { get as getTileAt, AreaData, getIterator } from 'ennea-tree';
import { CompiledComponent, createForest, drawComponent, IHavePosition, isEmpty, packageComponent, clear, Forest, Component, COMPONENT } from 'ekkiog-editing';
import { put, select, take } from 'redux-saga/effects';

import {
  insertComponent,
  InsertComponentPackageAction,
  resetEditorMenu,
  saveForest,
  selectItem,
  showOkCancelMenu,
  stopSelection,
  popContext,
  setForest,
  pushContextLoading,
  forestLoaded,
  removeTileAt,
  DoubleTapAction,
  abortContextLoading,
} from '../actions';
import { State } from '../reduce';
import { ContextState } from '../reduce/context';
import { ViewState } from '../reduce/view';
import * as storage from '../storage';
import { loadOrPull } from './loadForest';
import setUrl from '../actions/router';

export default function* doubleTap({x, y} : DoubleTapAction){
  const state : State = yield select();

  if(x < 0 || y < 0 || x > 128 || y > 128){
    yield* popOut(state.context)
  }else{
    yield* goInto(state.context, state.view, x, y);
  }
}

function* goInto(context : ContextState, view : ViewState, x : number, y : number){
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

function* popOut(context : ContextState){
  const previousContext = context.previous;
  if(!previousContext) return;

  yield put(popContext());
  yield put(setUrl(context.repo, context.name));
  if(context.isReadOnly) return;

  const component = packageComponent(context.forest, context.repo, context.name, context.hash, context.hash);
  const {forest, didntFit} = replaceComponents(previousContext.forest, component);
  if(previousContext.forest !== forest){
    yield put(setForest(forest));
  }

  for(const position of didntFit) {
    yield put(showOkCancelMenu(false));
    yield put(removeTileAt(position.x, position.y))
    yield put(selectComponent(context, component, position));

    const {ok} = yield take('okCancel');
    if(ok) {
      const {selection} : State = yield select();
      if(selection.selection == false) return;
      yield put(insertComponent(component, {
        x: selection.x + selection.dx,
        y: selection.y + selection.dy
      }));
      yield put(stopSelection());
      yield put(resetEditorMenu());
    } else {
      yield put(stopSelection());
      yield put(resetEditorMenu());
    }
  };

  yield put(saveForest(`Updated ${component.name}`));
}

function replaceComponents(forest : Forest, newComponent : CompiledComponent){
  const didntFit = [] as {x : number, y : number}[];
  for(const item of getComponents(forest, newComponent.name)){
    if(item.data.hash === newComponent.hash) continue;
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

const selectComponent = (context : ContextState, component : CompiledComponent, position : IHavePosition) => {
  const buddyTree = context.forest.buddyTree;
  const forest = drawComponent(createForest(buddyTree), position.x|0, position.y|0, component);
  return selectItem(forest,
    {
      top : (position.y|0) - (component.height>>1),
      left: (position.x|0) - (component.width>>1),
      width: component.width|0,
      height: component.height|0
    }
  );
}


function *getComponents(forest : Forest, name : string) : IterableIterator<AreaData<Component>>{
  const size = forest.enneaTree.size;
  for(const item of getIterator(forest.enneaTree, box([0,0], [size, size]))){
    if(item.data.type === COMPONENT
    && item.data.name === name){
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

function locateRepo({repo, name} : {repo : string, name : string}, context : ContextState){
  return {
    repo: repo && repo.length > 0 ? repo : context.repo,
    name
  };
}
