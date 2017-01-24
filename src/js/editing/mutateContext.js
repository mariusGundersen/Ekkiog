import * as ennea from 'ennea-tree';

import reconcile from './reconciliation/reconcile.js';

export default function mutateContext(context, renderer, before, after){
  if(!context) return;
  if(!renderer) return;
  if(before === after) return;

  const changes = ennea.diff(before.enneaTree, after.enneaTree)
  const changed = reconcile(context, changes);
  if(!changed) return;

  context.mapTexture.update();
  context.netMapTexture.update();
  context.gatesTexture.update();

  renderer.simulateTick(context);
  renderer.renderMap(context);
}