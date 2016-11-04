import set from './set.js';
import update from './update.js';
import clear from './clear.js';

export default function reconcile(context, changes){
  for(const change of changes){
    reconcileChange(context, change);
  }
}

export function reconcileChange(context, change){
  switch(change.type){
    case 'set':
      return set(context, change);
    case 'clear':
      return clear(context, change);
    case 'update':
      return update(context, change);
  }
}
