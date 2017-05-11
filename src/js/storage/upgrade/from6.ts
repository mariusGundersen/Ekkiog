import {UpgradeDB} from 'idb';

export default function upgradeFrom6(db : UpgradeDB){
  const recent = db.createObjectStore('recent', {keyPath: 'name'});
  recent.createIndex('usedAt', 'usedAt', {unique: false});

  const popular = db.createObjectStore('popular', {keyPath: 'name'});
  popular.createIndex('useCount', 'useCount', {unique: false});
}