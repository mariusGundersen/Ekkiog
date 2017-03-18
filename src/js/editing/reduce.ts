import {
  Forest,

  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,

  createForest,

  getTypeAt,

  drawWire,
  drawGate,
  drawUnderpass,
  drawButton,
  drawComponent,

  clear,
  toggleButton,
} from 'ekkiog-editing';

import { Tool } from './types';

import {
  SET_FOREST,
  TAP_TILE,
  REMOVE_TILE_AT,
  TO_UNDERPASS,
  TO_WIRE,
  INSERT_COMPONENT
} from '../actions.js';

export default function reduce(forest=createForest(), action : any){
  switch(action.type){
    case SET_FOREST:
      return action.forest || forest;
    case TAP_TILE:
      return tap(forest, action.tool, action.x, action.y);
    case REMOVE_TILE_AT:
      return clear(forest, action.x, action.y);
    case TO_UNDERPASS:
      return wireToUnderpass(forest, action.x, action.y);
    case TO_WIRE:
      return underpassToWire(forest, action.x, action.y);
    case INSERT_COMPONENT:
      return drawComponent(forest, action.position.x, action.position.y, action.component);
    default:
      return forest;
  }
}

function tap(forest : Forest, tool : Tool, x : number, y : number) : Forest{
  const type = getTypeAt(forest.enneaTree, x, y);
  if(type === BUTTON){
    return toggleButton(forest, x, y);
  }else if(tool === WIRE){
    if(type === WIRE || type === UNDERPASS){
      return clear(forest, x, y);
    }else{
      return drawWire(forest, x, y);
    }
  }else if(tool === UNDERPASS){
    if(type === UNDERPASS || type === WIRE){
      return clear(forest, x, y);
    }else{
      return drawUnderpassWithWires(forest, x, y);
    }
  }else if(tool === GATE){
    return drawGate(forest, x, y);
  }else if(tool === BUTTON){
    return drawButton(forest, x, y);
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