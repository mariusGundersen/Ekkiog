import {
  Forest
} from 'ekkiog-editing';

import {
  Context
} from './types';

import mutateContext from './mutateContext';
import {
  SET_FOREST
} from '../actions.js';

export default function createContextMiddleware(){
  return (store : any) => (next : any) => (action : any) => {
    const before = store.getState() as {selection : {forest : Forest}, forest : Forest};
    const result = next(action);
    const after = store.getState() as {selection : {forest : Forest}, forest : Forest};

    selectionHandler(before.selection.forest, after.selection.forest, before);
    forestHandler(before.forest, after.forest, before);
    saveHandler(before.forest, after.forest, before, action);

    return result;
  }
}

function selectionHandler(before : Forest, after : Forest, {global: {selectionContext, renderer}} : any){
  mutateContext(selectionContext, renderer, before, after);
}

function forestHandler(before : Forest, after : Forest, {global: {context, renderer}} : any){
  mutateContext(context, renderer, before, after);
}

function saveHandler(before : Forest, after : Forest, state : any, action : any){
  if(before !== after && action.type !== SET_FOREST){
    state.global.database.save('xor', after);
  }
}