import createForest from './actions/createForest.js';

import {
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON
} from './constants.js';

import {
  SET_FOREST,
  TAP_TILE,
  REMOVE_TILE_AT,
  TO_UNDERPASS,
  TO_WIRE,
} from '../actions.js';

import getTypeAt from './query/getTypeAt.js';

import drawWire from './actions/drawWire.js';
import drawGate from './actions/drawGate.js';
import drawUnderpass from './actions/drawUnderpass.js';
import drawButton from './actions/drawButton.js';
import drawComponent from './actions/drawComponent.js';

import clear from './actions/clear.js';
import toggleButton from './actions/toggleButton.js';

export default function reduce(forest=createForest(), action){
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
    default:
      return forest;
  }
}

function tap(forest, tool, x, y){
  const type = getTypeAt(forest.enneaTree, x, y);
  if(type === BUTTON){
    return toggleButton(forest, x, y);
  }else if(tool === WIRE){
    if(type === WIRE){
      return clear(forest, x, y);
    }else{
      return drawWire(forest, x, y);
    }
  }else if(tool === UNDERPASS){
    if(type === UNDERPASS){
      return clear(forest, x, y);
    }else{
      return drawUnderpassWithWires(forest, x, y);
    }
  }else if(tool === GATE){
    return drawComponent(forest, x, y);
  }else if(tool === BUTTON){
    return drawButton(forest, x, y);
  }else{
    return forest;
  }
}

function drawUnderpassWithWires(forest, x, y){
  const forest1 = drawUnderpass(forest, x, y);
  if(forest === forest1){
    return forest;
  }
  const forest2 = drawWire(forest1, x, y-1);
  const forest3 = drawWire(forest2, x, y+1);
  return forest3;
}

function wireToUnderpass(forest, x, y){
  const type = getTypeAt(forest.enneaTree, x, y);
  if(type !== WIRE) return forest;

  const tempForest = clear(forest, x, y);
  const result = drawUnderpassWithWires(tempForest, x, y);
  if(result === tempForest) return forest;

  return result;
}

function underpassToWire(forest, x, y){
  const type = getTypeAt(forest.enneaTree, x, y);
  if(type !== UNDERPASS) return forest;

  const tempForest = clear(forest, x, y);
  const result = drawWire(tempForest, x, y);
  if(result === tempForest) return forest;

  return result;
}