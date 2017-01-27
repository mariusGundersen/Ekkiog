export default async function upgradeFrom0(db){
  const components = db.createObjectStore('components', {keyPath: 'name'});
}