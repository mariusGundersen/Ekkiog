import { Forest } from 'ekkiog-editing';
import { Dispatch, Store } from 'redux';

import { Action } from '../actions';
import { State } from '../reduce';
import { EditorState } from '../reducers/editor';
import storage from '../storage';

export default function createContextMiddleware(){
  return (store : Store<State>) => (next : Dispatch<State>) => (action : any) => {
    const before = store.getState();
    const result = next(action);
    const after = store.getState();

    saveHandler(before.forest, after.forest, before.editor, action);

    return result;
  }
}

export function saveHandler(before : Forest, after : Forest, editor : EditorState, action : Action){
  if(before !== after && action.type !== 'set-forest'){
    storage.save(editor.currentComponentName, after);
  }
}