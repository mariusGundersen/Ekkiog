import set from './reconcile/set.js';
import update from './reconcile/update.js';
import clear from './reconcile/clear.js';

export default function reconcile(context, changes){
  for(const change of changes){
    console.log('change', change);
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
