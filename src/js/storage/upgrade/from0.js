export default async function upgradeFrom0(db){
  return await db.createObjectStore('saves');
}