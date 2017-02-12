import {
  Forest,
  diffAndReconcile
} from 'ekkiog-editing';

import {
  Context
} from './types';

export default function mutateContext(context : Context , renderer : any, before : Forest, after : Forest){
  if(!context) return;
  if(!renderer) return;
  if(before === after) return;

  const changed = diffAndReconcile(before.enneaTree, after.enneaTree, context);
  if(!changed) return;

  context.mapTexture.update();
  context.netMapTexture.update();
  context.gatesTexture.update();

  renderer.simulateTick(context);
  renderer.renderMap(context);
}