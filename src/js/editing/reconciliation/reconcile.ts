import {
  SET,
  UPDATE,
  CLEAR,
  Change
} from 'ennea-tree';

import set from './set.js';
import update from './update.js';
import clear from './clear.js';

import { Item, Context } from '../types';

export default function reconcile(context : Context, changes : Change<Item>[]){
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
