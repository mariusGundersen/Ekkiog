import {
  Forest,
  diffAndReconcile
} from 'ekkiog-editing';

import Engine, { ContextMutator } from '../engines/Engine';

export default function mutateContext(context : ContextMutator, before : Forest, after : Forest){
  if(before === after) return false;

  return context.mutateContext(mutableContext => diffAndReconcile(before.enneaTree, after.enneaTree, mutableContext));
}