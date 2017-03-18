import xor from '../scripts/xor.js';

export default function upgradeFrom3(db){
  return db.transaction
    .objectStore('components')
    .put({
      name: 'xor',
      ...xor()
    });
}
