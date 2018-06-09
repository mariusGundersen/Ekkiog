import { Forest, diffAndReconcile, createEnneaTree } from 'ekkiog-editing';

import Engine from '../engines/Engine';

export default function forestHandler(before : Forest | undefined, after : Forest, engine : Engine){
  if(before === after) return;
  engine.mutateContext(mutableContext => diffAndReconcile(before ? before.enneaTree : createEnneaTree(), after.enneaTree, mutableContext));
}
