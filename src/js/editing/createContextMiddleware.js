import mutateContext from './mutateContext';
import {
  SET_FOREST
} from '../actions.js';

export default function createContextMiddleware(){
  return store => next => action => {
    const before = store.getState();
    const result = next(action);
    const after = store.getState();

    selectionHandler(before.selection.forest, after.selection.forest, before, action);
    forestHandler(before.forest, after.forest, before, action);
    saveHandler(before.forest, after.forest, before, action);

    return result;
  }
}

function selectionHandler(before, after, {global: {selectionContext, renderer}}){
  mutateContext(selectionContext, renderer, before, after);
}

function forestHandler(before, after, {global: {context, renderer}}){
  mutateContext(context, renderer, before, after);
}

function saveHandler(before, after, state, action){
  if(before !== after && action.type !== SET_FOREST){
    state.global.database.save(after);
  }
}