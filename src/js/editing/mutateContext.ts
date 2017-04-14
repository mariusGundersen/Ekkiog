import {
  Forest,
  diffAndReconcile
} from 'ekkiog-editing';

import {
  MutableContext
} from './types';

export default function mutateContext(context : MutableContext , renderer : any, before : Forest, after : Forest){
  if(!context) return;
  if(!renderer) return;
  if(before === after) return;

  const changed = diffAndReconcile(before.enneaTree, after.enneaTree, context);
  if(!changed) return;

  context.updateDataTextures();

  renderer.simulateTick(context);
  renderer.renderMap(context);
}