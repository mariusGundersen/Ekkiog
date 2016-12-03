import {getIterator, update} from 'ennea-tree';

export default async function upgradeFrom0(db){
  const forest = await db.transaction.objectStore('saves').get('default');
  if(!forest) return;
  if(!forest.enneaTree) return;
  for(const gate of getGates(forest.enneaTree)){
    if(typeof(gate.inputA) === 'object'){
      console.log(gate);
      gate.inputA = gate.inputA.net;
      gate.inputB = gate.inputB.net;
    }
  }

  await db.transaction.objectStore('saves').put(forest, 'default');
}

function* getGates(enneaTree){
  for(const tile of getIterator(enneaTree, {top: 0, left: 0, width: enneaTree.size, height: enneaTree.size})){
    if(tile.data.type === 'gate'){
      console.log(tile);
      yield tile.data;
    }
  }
}