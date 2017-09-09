import { createForest, diffAndReconcile } from 'ekkiog-editing';

import Engine from '../engines/Engine';
import { SelectionState } from '../reduce/selection';

export default function moveHandler(before : SelectionState, after : SelectionState, engine : Engine){
  if(!before.selection && !after.selection) return;
  const beforeForest = before.selection ? before.forest : createForest();
  const afterForest = after.selection ? after.forest : createForest();
  if(beforeForest === afterForest) return;
  engine.mutateMoveContext(mutableContext => diffAndReconcile(beforeForest.enneaTree, afterForest.enneaTree, mutableContext));
}