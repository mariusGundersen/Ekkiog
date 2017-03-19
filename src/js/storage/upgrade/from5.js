import xor from '../scripts/xor.js';

export default function upgradeFrom5(db){
  return db.transaction
    .objectStore('components')
    .put({
      name: 'XOR',
      ...xor()
    });
}
