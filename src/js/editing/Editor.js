import ndarray from 'ndarray';
import * as ennea from 'ennea-tree';

import {
  WIRE_TILE,
  GATE_TILE,
  UNDERPASS_TILE,
  BUTTON_TILE
} from './tileConstants.js';

import {
  EMPTY,
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
  GROUND
} from './constants.js';

import getTypeAt from './query/getTypeAt.js';
import reconcile from './reconciliation/reconcile.js';

import drawWire from './actions/drawWire.js';
import drawGate from './actions/drawGate.js';
import drawUnderpass from './actions/drawUnderpass.js';
import drawButton from './actions/drawButton.js';
import clear from './actions/clear.js';
import toggleButton from './actions/toggleButton.js';

import mutateContext from './mutateContext.js';

export default class Editor{
  constructor(context){
    this.context = context;
  }

  drawWire(x, y){
    const context = drawWire(this.context, x, y);

    if(this.context === context){
      return false;
    }

    mutateContext(this.context, this.context.enneaTree, context.enneaTree);

    this.context.enneaTree = context.enneaTree;
    return true;
  }

  drawGate(x, y){
    const context = drawGate(this.context, x, y);

    if(this.context === context){
      return false;
    }

    mutateContext(this.context, this.context.enneaTree, context.enneaTree);

    this.context.enneaTree = context.enneaTree;
    this.context.buddyTree = context.buddyTree;
    return true;
  }

  drawUnderpass(x, y){
    const context = drawUnderpass(this.context, x, y);

    if(this.context === context){
      return false;
    }

    mutateContext(this.context, this.context.enneaTree, context.enneaTree);

    this.context.enneaTree = context.enneaTree;
    return true;
  }

  drawButton(x, y){
    const context = drawButton(this.context, x, y);

    if(this.context === context){
      return false;
    }

    mutateContext(this.context, this.context.enneaTree, context.enneaTree);

    this.context.enneaTree = context.enneaTree;
    this.context.buddyTree = context.buddyTree;
    return true;
  }

  clear(x, y){
    const context = clear(this.context, x, y);

    if(this.context === context){
      return false;
    }

    mutateContext(this.context, this.context.enneaTree, context.enneaTree);

    this.context.enneaTree = context.enneaTree;
    this.context.buddyTree = context.buddyTree;
    return true;
  }

  toggleButton(x, y){
    const context = toggleButton(this.context, x, y);

    if(this.context === context){
      return false;
    }

    mutateContext(this.context, this.context.enneaTree, context.enneaTree);

    this.context.enneaTree = context.enneaTree;
    return true;
  }

  draw(x, y, tool){
    if(tool === WIRE){
      if(this.getTileAt(x, y) === WIRE){
        return this.clear(x, y);
      }else{
        return this.drawWire(x, y);
      }
    }else if(tool === UNDERPASS){
      if(this.getTileAt(x, y) === UNDERPASS){
        return this.clear(x, y);
      }else{
        return this.drawUnderpass(x, y);
      }
    }else if(tool === GATE){
      return this.drawGate(x, y);
    }else if(tool === BUTTON){
      return this.drawButton(x, y);
    }else{
      return false;
    }
  }

  getTileAt(x, y){
    getTypeAt(this.context.enneaTree, x, y);
  }

  moveSelection(top, left, right, bottom, dx, dy){
    const width = right-left+1;
    const height = bottom-top+1;
    const selection = ndarray([], [height, width]);
    const sourceMap = this.context.mapTexture.map.lo(top, left).hi(height, width);
    for(let y=0; y<height; y++){
      for(let x=0; x<width; x++){
        selection.set(y, x, toTool(sourceMap.get(y, x)));
      }
    }
    for(let y=0; y<height; y++){
      for(let x=0; x<width; x++){
        this.clear(left+x, top+y);
      }
    }
    for(let y=0; y<height; y++){
      for(let x=0; x<width; x++){
        this.draw(left+x+dx, top+y+dy, selection.get(y, x));
      }
    }
  }
}

function toTool(value){
  switch(value){
    case WIRE_TILE: return WIRE;
    case GATE_TILE: return GATE;
    case UNDERPASS_TILE: return UNDERPASS;
    case BUTTON_TILE: return BUTTON;
    default: return EMPTY;
  }
}
