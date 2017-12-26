import {UpgradeDB} from 'idb';

export default function upgradeFrom7(db : UpgradeDB){
  const recent = db.createObjectStore('recent', {keyPath: ['repo', 'name']});
  recent.createIndex('usedAt', 'usedAt', {unique: false});

  const favorite = db.createObjectStore('favorite', {keyPath: ['repo', 'name']});

  if(db.objectStoreNames.contains('componentMetadata')) db.deleteObjectStore('componentMetadata');
}