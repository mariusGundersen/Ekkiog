import * as ennea from 'ennea-tree';

import mutateContext from './mutateContext.js';
import {
  SET_FOREST
} from '../actions.js';

export default function createContextMiddleware(){
  return store => next => action => {
    const before = store.getState();
    const result = next(action);
    const after = store.getState();

    const changes = ennea.diff(before.forest.enneaTree, after.forest.enneaTree);
    mutateContext(before.global.context, before.global.renderer, changes);

    if(before.forest !== after.forest && action.type !== SET_FOREST){
      after.global.database.save(after.forest);
    }

    return result;
  }
}