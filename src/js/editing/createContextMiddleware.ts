import {
  Forest,
  createForest
} from 'ekkiog-editing';

import { Dispatch, Store, Action } from 'redux';

import { State } from '../reduce';
import { SelectionState, ComponentSelectedState, NothingSelectedState } from '../reducers/selection';
import { GlobalState, GlobalStateInitialized } from '../reducers/global';
import storage from '../storage';

import mutateContext from './mutateContext';

export default function createContextMiddleware(){
  return (store : Store<State>) => (next : Dispatch<State>) => (action : any) => {
    const before = store.getState();
    const result = next(action);
    const after = store.getState();

    if(after.global.initialized){

      moveHandler(before.selection, after.selection, after.global);
      forestHandler(before.forest, after.forest, after.global);
      saveHandler(before.forest, after.forest, before, action);
    }

    return result;
  }
}

function moveHandler(before : SelectionState, after : SelectionState, {engine} : GlobalStateInitialized){
  if(!before.selection && !after.selection) return;
  const beforeForest = before.selection ? before.forest : createForest();
  const afterForest = after.selection ? after.forest : createForest();
  const changed = mutateContext(engine.moveContext, beforeForest, afterForest);
  if(!changed) return;

  engine.updateMove();
}

function forestHandler(before : Forest, after : Forest, {engine} : GlobalStateInitialized){
  const changed = mutateContext(engine.context, before, after);
  if(!changed) return;

  engine.simulate();
  engine.update();
}

function saveHandler(before : Forest, after : Forest, state : State, action : Action){
  if(before !== after && action.type !== 'set-forest'){
    storage.save(state.editor.currentComponentName, after);
  }
}