import {UpgradeDB} from 'idb';

export default function upgradeFrom7(db : UpgradeDB){
  const metadataStore = db.createObjectStore('componentMetadata', {keyPath: 'name'});
  metadataStore.createIndex('usedAt', 'usedAt', {unique: false});
  metadataStore.createIndex('useCount', 'useCount', {unique: false});
  metadataStore.createIndex('favorite', 'favorite', {unique: false});

  if(db.objectStoreNames.contains('recent')) db.deleteObjectStore('recent');
  if(db.objectStoreNames.contains('popular')) db.deleteObjectStore('popular');

  const tx = db.transaction;
  const metadata = tx.objectStore('componentMetadata');
  tx.objectStore('components').iterateCursor(cursor => {
    if (!cursor) return;
    metadata.put({
      name: cursor.value.name
    })
    cursor.continue();
  });
}