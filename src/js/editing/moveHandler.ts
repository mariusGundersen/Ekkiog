import { createEnneaTree, diffAndReconcile } from '../editing';

import Engine from '../engines/Engine';
import { SelectionState } from '../reduce/selection';

export default function moveHandler(before: SelectionState, after: SelectionState, engine: Engine) {
  if (!before && !after) return;
  const beforeForest = before ? before.enneaTree : createEnneaTree();
  const afterForest = after ? after.enneaTree : createEnneaTree();
  if (beforeForest === afterForest) return;
  engine.mutateMoveContext(mutableContext => diffAndReconcile(beforeForest, afterForest, mutableContext));
}
