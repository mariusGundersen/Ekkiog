import xor from '../scripts/xor';
import and from '../scripts/and';

import {UpgradeDB} from 'idb';

export default function upgradeFrom5(db : UpgradeDB){
  const components = db.transaction.objectStore('components');

  components
    .put({
      name: 'XOR',
      ...xor()
    });

  components
    .put({
      name: 'AND',
      ...and()
    });

  components
    .put({
      name: 'Welcome',
      ...xor()
    });
}
