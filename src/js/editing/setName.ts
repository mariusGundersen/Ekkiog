import { Forest, Button, BUTTON, LIGHT } from 'ekkiog-editing';
import { update } from 'ennea-tree';

export default function setName(forest : Forest, x : number, y : number, name : string){
  const updater = update(forest.enneaTree, (data, context, pos) => {
    switch(data.type){
      case BUTTON:
      case LIGHT:
        return {
          ...data,
          name
        };
      default:
        return data;
    }
  }, (before, after) => before === after);
  updater.update({top: y, left: x}, {});
  const enneaTree = updater.result();
  if(enneaTree === forest.enneaTree) return forest;
  return {
    ...forest,
    enneaTree
  };
}