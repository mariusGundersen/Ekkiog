import {
  Forest,
  diffAndReconcile
} from 'ekkiog-editing';

import Engine, { MutableContext } from '../engines/Engine';

export default function mutateContext(context : MutableContext, before : Forest, after : Forest){
  if(before === after) return false;

  const changed = diffAndReconcile(before.enneaTree, after.enneaTree, context);
  if(!changed) return false;

  context.updateDataTextures();

  return true;
}