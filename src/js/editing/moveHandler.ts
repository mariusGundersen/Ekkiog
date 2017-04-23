import { createForest } from 'ekkiog-editing';

import Engine from '../engines/Engine';
import { SelectionState } from '../reducers/selection';
import mutateContext from './mutateContext';

export default function moveHandler(before : SelectionState, after : SelectionState, engine : Engine){
  if(!before.selection && !after.selection) return;
  const beforeForest = before.selection ? before.forest : createForest();
  const afterForest = after.selection ? after.forest : createForest();
  const changed = mutateContext(engine.moveContext, beforeForest, afterForest);
  if(!changed) return;

  engine.updateMove();
}