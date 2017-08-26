import {UpgradeDB} from 'idb';

export default function upgradeFrom10(db : UpgradeDB){
  if(db.objectStoreNames.contains('components')) db.deleteObjectStore('components');

  db.createObjectStore("objects", { keyPath: "hash" });
  db.createObjectStore("refs", { keyPath: "path" });
  db.createObjectStore("metadata", { keyPath: "name" });
}