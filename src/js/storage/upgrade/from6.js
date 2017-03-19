import and from '../scripts/and.js';

export default function upgradeFrom6(db){
  return db.transaction
    .objectStore('components')
    .put({
      name: 'AND',
      ...and()
    });
}
