export default function(emitter){
  return ({getState, dispatch}) => next => action => {
    if(action.meta && typeof(action.meta) == 'object' && action.meta.emit){
      console.log('emit', action);
      emitter.emit(action.meta.emit, action);
    }
    return next(action)
  };
}