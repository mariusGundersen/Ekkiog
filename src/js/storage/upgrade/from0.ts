import {UpgradeDB} from 'idb';

export default function upgradeFrom0(db : UpgradeDB){
  db.createObjectStore('components', {keyPath: 'name'});
}