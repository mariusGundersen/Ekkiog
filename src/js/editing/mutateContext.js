import * as ennea from 'ennea-tree';

import reconcile from './reconciliation/reconcile.js';

export default function mutateContext(context, renderer, oldForest, newForest){
  if(oldForest === newForest) return;

  if(!context) return;
  if(!renderer) return;

  const changes = ennea.diff(oldForest.enneaTree, newForest.enneaTree);
  reconcile(context, changes);

  context.mapTexture.update();
  context.netMapTexture.update();
  context.gatesTexture.update();

  renderer.simulateTick(context, renderer.currentTick);
  renderer.renderMap(context);
}