import { EnneaTree, Box } from 'ekkiog-editing';
import { getIterator } from 'ennea-tree';

export default function getComponentBoundingBox(tree : EnneaTree) : Box {
  const box = {
    top: tree.size,
    left: tree.size,
    right: 0,
    bottom: 0
  };

  for(const item of getIterator(tree, {top: 0, left: 0, width: tree.size, height: tree.size})){
    box.top = Math.min(box.top, item.top-5);
    box.left = Math.min(box.left, item.left-5);
    box.right = Math.max(box.right, item.left+item.width+5);
    box.bottom = Math.max(box.bottom, item.top+item.height+5);
  }

  if(box.top > box.bottom){
    return {
      top: 56,
      left: 56,
      right: 72,
      bottom: 72
    };
  }

  return box;
}
