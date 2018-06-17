import {
  Forest,
  Direction,
  Tool,
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
  LIGHT,
  createForest,

  getTypeAt,

  drawWire,
  drawGate,
  drawUnderpass,
  drawButton,
  drawComponent,
  drawLight,
  clear
} from 'ekkiog-editing';

import {
  Action
} from '../actions';

export { Forest };

export default function editing(forest=createForest(), action : Action) : Forest{
  switch(action.type){
    case 'set-forest':
      return action.forest || forest;
    case 'draw':
      return tap(forest, action.tool, action.direction, action.x, action.y);
    case 'remove-tile-at':
      return clear(forest, action.x, action.y);
    case 'convert-wire-to-underpass':
      return wireToUnderpass(forest, action.x, action.y);
    case 'convert-underpass-to-wire':
      return underpassToWire(forest, action.x, action.y);
    case 'insert-component':
      return drawComponent(forest, action.position.x+(action.component.width>>1), action.position.y+(action.component.height>>1), action.component);
    default:
      return forest;
  }
}

export function tap(forest : Forest, tool : Tool, direction : Direction, x : number, y : number) : Forest {
  if(tool === WIRE){
  const type = getTypeAt(forest.enneaTree, x, y);
    if(type === WIRE || type === UNDERPASS){
      return clear(forest, x, y);
    }else{
      return drawWire(forest, x, y);
    }
  }else if(tool === UNDERPASS){
    const type = getTypeAt(forest.enneaTree, x, y);
    if(type === UNDERPASS || type === WIRE){
      return clear(forest, x, y);
    }else{
      return drawUnderpassWithWires(forest, x, y);
    }
  }else if(tool === GATE){
    return drawGate(forest, x, y);
  }else if(tool === BUTTON){
    return drawButton(forest, x, y, direction);
  }else if(tool === LIGHT){
    return drawLight(forest, x, y, direction);
  }else{
    return forest;
  }
}

function drawUnderpassWithWires(forest : Forest, x : number, y : number){
  const forest1 = drawUnderpass(forest, x, y);
  if(forest === forest1){
    return forest;
  }
  const forest2 = drawWire(forest1, x, y-1);
  const forest3 = drawWire(forest2, x, y+1);
  const forest4 = drawWire(forest3, x-1, y);
  const forest5 = drawWire(forest4, x+1, y);
  return forest5;
}

function wireToUnderpass(forest : Forest, x : number, y : number){
  const type = getTypeAt(forest.enneaTree, x, y);
  if(type !== WIRE) return forest;

  const tempForest = clear(forest, x, y);
  const result = drawUnderpassWithWires(tempForest, x, y);
  if(result === tempForest) return forest;

  return result;
}

function underpassToWire(forest : Forest, x : number, y : number){
  const type = getTypeAt(forest.enneaTree, x, y);
  if(type !== UNDERPASS) return forest;

  const tempForest = clear(forest, x, y);
  const result = drawWire(tempForest, x, y);
  if(result === tempForest) return forest;

  return result;
}
