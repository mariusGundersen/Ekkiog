import mutateContext from './mutateContext.js';

export default function createContextMiddleware(storage){
  return store => next => action => {
    const before = store.getState();
    const result = next(action);
    const after = store.getState();
    mutateContext(before.global.context, before.global.renderer, before.forest, after.forest);

    if(before.forest !== after.forest && action.type !== 'set-forest'){
      storage.save(after.forest);
    }

    return result;
  }
}