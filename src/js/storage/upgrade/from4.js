import xor from '../xor.json';

export default function upgradeFrom3(db){
  return db.transaction
    .objectStore('saves')
    .put(xor, 'welcome');
}

