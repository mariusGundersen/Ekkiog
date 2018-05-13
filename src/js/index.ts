import '../icons/favicon.ico';
import '../manifest.json';
import offline from './offline';

if('asyncIterator' in Symbol === false){
  (Symbol as any).asyncIterator = Symbol();
}

offline();

import('./start')