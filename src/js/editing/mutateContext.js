import reconcile from './reconciliation/reconcile.js';

export default function mutateContext(context, renderer, changes){
  if(!context) return;
  if(!renderer) return;

  const changed = reconcile(context, changes);
  if(!changed) return;

  context.mapTexture.update();
  context.netMapTexture.update();
  context.gatesTexture.update();

  renderer.simulateTick(context);
  renderer.renderMap(context);
}