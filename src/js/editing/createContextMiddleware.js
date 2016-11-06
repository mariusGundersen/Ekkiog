import mutateContext from './mutateContext.js';

export default function createContextMiddleware(world){
  return store => next => action => {
    const before = store.getState().forest;
    const result = next(action);
    const after = store.getState().forest;
    mutateContext(world.context, world.renderer, before, after);
    return result;
  }
}