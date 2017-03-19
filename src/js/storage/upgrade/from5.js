import xor from '../scripts/xor.js';
import and from '../scripts/and.js';

export default async function upgradeFrom5(db){
  const components = db.transaction.objectStore('components');

  await components
    .put({
      name: 'XOR',
      ...xor()
    });

  await components
    .put({
      name: 'AND',
      ...and()
    });

  await components
    .put({
      name: 'Welcome',
      ...xor()
    });
}
