import {
  clear,
  CompiledComponent,
  COMPONENT,
  Component,
  createForest,
  drawComponent,
  Forest,
  IHavePosition,
  packageComponent,
} from 'ekkiog-editing';
import { AreaData, getIterator } from 'ennea-tree';
import { put, select, take } from 'redux-saga/effects';

import {
  insertComponent,
  popContext,
  removeTileAt,
  resetEditorMenu,
  saveForest,
  selectItem,
  setForest,
  showOkCancelMenu,
  stopSelection,
  ZoomOutOfAction,
} from '../actions';
import setUrl from '../actions/router';
import { State } from '../reduce';
import { ContextState } from '../reduce/context';

export default function* zomOutOf({} : ZoomOutOfAction){
  const { context: currentContext } : State = yield select();

  const previousContext = currentContext.previous;
  if(!previousContext) return;

  const context : ContextState = yield* waitUntilSaved(currentContext);

  yield put(popContext());
  yield put(setUrl(previousContext.repo, previousContext.name));
  if(context.isReadOnly || previousContext.isReadOnly) return;

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

function* waitUntilSaved(context : ContextState){
  if(context.saving) {
    yield take('forest-saved');
    return (yield select()).context;
  }else{
    return context;
  }
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
