import { Forest, diffAndReconcile } from 'ekkiog-editing';

import Engine from '../engines/Engine';

export default function forestHandler(before : Forest, after : Forest, engine : Engine){
  if(before === after) return;
  engine.mutateContext(mutableContext => diffAndReconcile(before.enneaTree, after.enneaTree, mutableContext));
}
