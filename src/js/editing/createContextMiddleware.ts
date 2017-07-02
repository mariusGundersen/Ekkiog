import { Forest } from 'ekkiog-editing';
import { Dispatch, Store, Middleware, MiddlewareAPI } from 'redux';

import { Action } from '../actions';
import { State } from '../reduce';
import { EditorState } from '../reducers/editor';
import storage from '../storage';

export default function createContextMiddleware() : Middleware {
  return <S>(store : MiddlewareAPI<S>) => (next : Dispatch<S>) => (action : any) => {
    const before = store.getState() as any as State;
    const result = next(action);
    const after = store.getState() as any as State;

    saveHandler(before.forest, after.forest, before.editor, action);

    return result;
  }
}

export function saveHandler(before : Forest, after : Forest, editor : EditorState, action : Action){
  if(before !== after && action.type !== 'set-forest'){
    storage.save(editor.currentComponentName, after);
  }
}