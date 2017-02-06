import {
  SET,
  UPDATE,
  CLEAR,
  Change
} from 'ennea-tree';

import set from './set';
import update from './update';
import clear from './clear';

import { Item, Context } from '../types';

export default function reconcile(context : Context, changes : IterableIterator<Change<Item>>){
  let changed = false;
  for(const change of changes){
    changed = true;
    reconcileChange(context, change);
  }
  return changed;
}

export function reconcileChange(context : Context, change : Change<Item>){
  switch(change.type){
    case SET:
      return set(context, change);
    case CLEAR:
      return clear(context, change);
    case UPDATE:
      return update(context, change);
  }
}
