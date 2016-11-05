import ndarray from 'ndarray';
import * as ennea from 'ennea-tree';

import ContextQuery from './ContextQuery.js';
import {
  EMPTY,
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON
} from './tileConstants.js';

import {
  getWireNeighbouringNets,
  getGateNeighbouringNets,
  getUnderpassNeighbouringNets,
  getButtonNeighbouringNets
} from './query/getNeighbouringNets.js';
import floodFill from './flooding/floodFill.js';
import reconcile from './reconciliation/reconcile.js';

const GROUND = 0;

export default class Editor{
  constructor(context){
    this.context = context;
    this.query = new ContextQuery(this.context);
  }

  drawWire(x, y){
    const neighbouringNets = getWireNeighbouringNets(this.context.enneaTree, x, y);

    if(neighbouringNets.length > 1){
      return false;
    }

    const net = neighbouringNets[0] || GROUND;
    const data = {
      type: 'wire',
      net
    };
    const box = {left:x, top:y};
    let enneaTree = ennea.set(this.context.enneaTree, data, box);

    if(this.context.enneaTree === enneaTree){
      return false;
    }

    enneaTree = floodFill(enneaTree, net, {...box, data});

    const changes = ennea.diff(this.context.enneaTree, enneaTree);
    reconcile(this.context, changes);

    this.context.enneaTree = enneaTree;

    return true;
  }

  drawGate(x, y){
    const neighbouringNets = getGateNeighbouringNets(this.context.enneaTree, x, y);

    if(neighbouringNets.length === 1){
      return false;
    }

    const net = this.query.getNextNet();
    const inputA = ennea.get(this.context.enneaTree, y-1, x-4);
    const inputB = ennea.get(this.context.enneaTree, y+1, x-4);
    const data = {
      type: 'gate',
      net,
      inputA: {
        net: inputA ? inputA.data.net : GROUND
      },
      inputB: {
        net: inputB ? inputB.data.net : GROUND
      }
    };
    const box = {left:x-3, top:y-1, width:4, height:3};
    let enneaTree = ennea.set(this.context.enneaTree, data, box);

    if(this.context.enneaTree === enneaTree){
      return false;
    }

    enneaTree = floodFill(enneaTree, net, {...box, data});

    const changes = ennea.diff(this.context.enneaTree, enneaTree);
    reconcile(this.context, changes);

    this.context.enneaTree = enneaTree;


    return true;
  }

  drawUnderpass(x, y){
    const neighbouringNets = getUnderpassNeighbouringNets(this.context.enneaTree, x, y);

    if(neighbouringNets.horizontal.length > 1 || neighbouringNets.vertical.length > 1){
      return false;
    }

    const net = neighbouringNets.horizontal[0] || GROUND;
    const data = {
      type: 'underpass',
      net
    };
    const box = {left:x, top:y};

    let enneaTree = ennea.set(this.context.enneaTree, data, box);

    if(this.context.enneaTree === enneaTree){
      return false;
    }

    enneaTree = ennea.set(enneaTree, {type:'wire', net: GROUND}, {left:x, top:y-1});
    enneaTree = ennea.set(enneaTree, {type:'wire', net: GROUND}, {left:x, top:y+1});

    enneaTree = floodFill(enneaTree, net, {...box, data});

    const changes = ennea.diff(this.context.enneaTree, enneaTree);
    reconcile(this.context, changes);

    this.context.enneaTree = enneaTree;
    return true;
  }

  drawButton(x, y){
    const neighbouringNets = getButtonNeighbouringNets(this.context.enneaTree, x, y);

    if(neighbouringNets.length === 1){
      return false;
    }

    const net = this.query.getNextNet();
    const data = {
      type: 'button',
      net,
      state: false
    };
    const box = {left:x-2, top:y-1, width:3, height:3};
    let enneaTree = ennea.set(this.context.enneaTree, data, box);

    if(this.context.enneaTree === enneaTree){
      return false;
    }

    enneaTree = floodFill(enneaTree, net, {...box, data});

    const changes = ennea.diff(this.context.enneaTree, enneaTree);
    reconcile(this.context, changes);

    this.context.enneaTree = enneaTree;


    return true;
  }

  clear(x, y){
    let [enneaTree, ...cleared] = ennea.clearBranch(this.context.enneaTree, {left:x, top:y});

    enneaTree = floodFill(enneaTree, GROUND, ...cleared);

    const changes = ennea.diff(this.context.enneaTree, enneaTree);
    reconcile(this.context, changes);

    this.context.enneaTree = enneaTree;

    return true;
  }

  draw(x, y, tool){
    if(tool === 'wire'){
      if(this.getTileAt(x, y) === 'wire'){
        return this.clear(x, y);
      }else{
        return this.drawWire(x, y);
      }
    }else if(tool === 'underpass'){
      if(this.getTileAt(x, y) === 'underpass'){
        return this.clear(x, y);
      }else{
        return this.drawUnderpass(x, y);
      }
    }else if(tool === 'gate'){
      return this.drawGate(x, y);
    }else if(tool === 'button'){
      return this.drawButton(x, y);
    }else{
      return false;
    }
  }

  getTileAt(x, y){
    const tile = ennea.get(this.context.enneaTree, y, x);
    if(!tile){
      return 'empty';
    }

    return tile.data.type;
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

  toggleButton(x, y){
    const updater = ennea.update(this.context.enneaTree, old => ({
      ...old,
      state: !old.state
    }));
    updater.update({top: y, left: x});
    const enneaTree = updater.result();

    const changes = ennea.diff(this.context.enneaTree, enneaTree);
    reconcile(this.context, changes);

    this.context.enneaTree = enneaTree;
  }
}

function toTool(value){
  switch(value){
    case WIRE: return 'wire';
    case GATE: return 'gate';
    case UNDERPASS: return 'underpass';
    case BUTTON: return 'button';
    default: return '';
  }
}