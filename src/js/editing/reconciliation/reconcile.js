import {
  SET,
  UPDATE,
  CLEAR
} from 'ennea-tree';

import set from './set.js';
import update from './update.js';
import clear from './clear.js';

export default function reconcile(context, changes){
  let changed = false;
  for(const change of changes){
    changed = true;
    reconcileChange(context, change);
  }
  return changed;
}

export function reconcileChange(context, change){
  switch(change.type){
    case SET:
      return set(context, change);
    case CLEAR:
      return clear(context, change);
    case UPDATE:
      return update(context, change);
  }
}
