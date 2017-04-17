import {UpgradeDB} from 'idb';

export default async function upgradeFrom0(db : UpgradeDB){
  const components = db.createObjectStore('components', {keyPath: 'name'});
}