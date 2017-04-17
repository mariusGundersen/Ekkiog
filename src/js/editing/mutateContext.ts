import {
  Forest,
  diffAndReconcile
} from 'ekkiog-editing';

import Renderer from '../engines/Renderer';

import  Context from '../Context';

export default function mutateContext(context : Context , renderer : Renderer, before : Forest, after : Forest){
  if(before === after) return;

  const changed = diffAndReconcile(before.enneaTree, after.enneaTree, context);
  if(!changed) return;

  context.updateDataTextures();

  renderer.simulateTick(context);
  renderer.renderMap(context);
}