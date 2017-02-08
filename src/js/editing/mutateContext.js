import { diffAndReconcile } from 'ekkiog-editing';

export default function mutateContext(context, renderer, before, after){
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