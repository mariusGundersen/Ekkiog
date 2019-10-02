import {
  SET,
  UPDATE,
  CLEAR,
  Change,
  ChangeClear,
  ChangeSet
} from 'ennea-tree';

import set from './set';
import update from './update';
import clear from './clear';

import { Item, MutableContext } from '../types';

export default function reconcile(context : MutableContext, changes : IterableIterator<Change<Item>>){
  let changed = false;
  for(const change of changes){
    changed = true;
    reconcileChange(context, change);
  }
  return changed;
}

export function reconcileChange(context : MutableContext, change : Change<Item>){
  switch(change.type){
    case SET:
      return set(context, change);
    case CLEAR:
      return clear(context, change);
    case UPDATE:
      if(change.before.type === change.after.type){
        return update(context, change);
      }else{
        clear(context, {...change, type: CLEAR} as ChangeClear<Item>);
        set(context, {...change, type: SET} as ChangeSet<Item>);
      }
  }
}
