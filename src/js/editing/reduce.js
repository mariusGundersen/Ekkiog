import createForest from './actions/createForest.js';

import {
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON
} from './constants.js';

import getTypeAt from './query/getTypeAt.js';

import drawWire from './actions/drawWire.js';
import drawGate from './actions/drawGate.js';
import drawUnderpass from './actions/drawUnderpass.js';
import drawButton from './actions/drawButton.js';
import clear from './actions/clear.js';
import toggleButton from './actions/toggleButton.js';

export default function reduce(forest=createForest(), action){
  switch(action.type){
    case 'tap-tile':
      return tap(forest, action.tool, action.x, action.y);
    case 'remove-tile-at':
      return clear(forest, action.x, action.y);
    case 'convert-wire-to-underpass':
      return wireToUnderpass(forest, action.x, action.y);
    case 'convert-underpass-to-wire':
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
      return drawUnderpass(forest, x, y);
    }
  }else if(tool === GATE){
    return drawGate(forest, x, y);
  }else if(tool === BUTTON){
    return drawButton(forest, x, y);
  }else{
    return forest;
  }
}

function wireToUnderpass(forest, x, y){
  const type = getTypeAt(forest.enneaTree, x, y);
  if(type !== WIRE) return forest;

  const tempForest = clear(forest, x, y);
  const result = drawUnderpass(tempForest, x, y);
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