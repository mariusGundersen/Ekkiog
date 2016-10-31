import ndarray from 'ndarray';
import * as ennea from 'ennea-tree';

import ContextQuery from './ContextQuery.js';
import Validator from './Validator.js';
import FloodFiller from './FloodFiller.js';
import {
  EMPTY,
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON
} from './tileConstants.js';

import {getWireSearchDirections} from './query/getSearchDirections.js';
import canPlaceWireHere from './validate/canPlaceWireHere.js';
import canPlaceGateHere from './validate/canPlaceGateHere.js';
import canPlaceButtonHere from './validate/canPlaceButtonHere.js';
import floodFill from './floodFill.js';
import reconcile from './reconcile.js';

const GROUND = 0;

export default class Editor{
  constructor(context){
    this.context = context;
    this.query = new ContextQuery(this.context);
    this.floodFiller = new FloodFiller(this.context, this.query);
    this.validate = new Validator(this.query);
  }

  drawWire(x, y){
    if(!canPlaceWireHere(this.context, x, y)) return false;

    const neighbours = [...getWireSearchDirections(this.context.enneaTree, x, y)];
    const neighbouringNets = neighbours
      .map(([x, y]) => this.context.netMapTexture.get(x, y))
      .filter(net => net != GROUND)
      .filter((net, index, nets) => nets.indexOf(net) === index);

    if(neighbouringNets.length > 1){
      return false;
    }

    const net = neighbouringNets[0] || GROUND;

    let enneaTree = ennea.set(this.context.enneaTree, {
      type: 'wire',
      net: GROUND
    }, {left:x, top:y});

    enneaTree = floodFill(enneaTree, net, {left:x, top:y});

    const changes = ennea.diff(this.context.enneaTree, enneaTree);
    reconcile(this.context, changes);

    this.context.enneaTree = enneaTree;
    //console.log(ennea.getAll(this.context.enneaTree, {top:0, left:0, width:this.context.enneaTree.size, height:this.context.enneaTree.size}));
    return true;
  }

  drawGate(x, y){
    if(!canPlaceGateHere(this.context.enneaTree, x-3, y-1)) return false;

    const net = this.query.getNextNet();
    const inputA = ennea.get(this.context.enneaTree, y-1, x-4);
    const inputB = ennea.get(this.context.enneaTree, y+1, x-4);
    let enneaTree = ennea.set(this.context.enneaTree, {
      type: 'gate',
      net,
      inputA: {
        net: inputA ? inputA.data.net : GROUND
      },
      inputB: {
        net: inputB ? inputB.data.net : GROUND
      }
    }, {left:x-3, top:y-1, width:4, height:3});

    enneaTree = floodFill(enneaTree, net, {left:x, top:y}, 1, 0);

    const changes = ennea.diff(this.context.enneaTree, enneaTree);
    reconcile(this.context, changes);

    this.context.enneaTree = enneaTree;
    //console.log(ennea.getAll(this.context.enneaTree, {top:0, left:0, width:this.context.enneaTree.size, height:this.context.enneaTree.size}));

    return true;
  }

  drawUnderpass(x, y){
    if(!this.validate.canPlaceUnderpassHere(x, y)) return false;

    if(this.query.isWire(x, y)){
      this.clearWire(x, y);
    }

    const neighbouringNets = this.query.getNeighbouringNets(x, y, UNDERPASS);

    this.context.mapTexture.set(x, y, UNDERPASS);
    const net = neighbouringNets[0] || GROUND;
    if(neighbouringNets.length == 1){
      const gatesToUpdate = this.floodFiller.floodFill(x, y, net);
      for(let [gateX, gateY] of gatesToUpdate){
        this.updateGate(gateX, gateY);
      }
    }

    this.context.enneaTree = ennea.set(this.context.enneaTree, {
      tile: UNDERPASS,
      net
    }, {left:x, top:y});
    console.log(ennea.getAll(this.context.enneaTree, {top:0, left:0, width:this.context.enneaTree.size, height:this.context.enneaTree.size}));

    const terminalAbove = this.query.getUnderpassTerminalAbove(x, y);
    const terminalBelow = this.query.getUnderpassTerminalBelow(x, y);
    const netAbove = this.query.getNet(x, terminalAbove);
    const netBelow = this.query.getNet(x, terminalBelow);

    if(netAbove != GROUND){
      const gatesToUpdate = this.floodFiller.floodFill(x, terminalAbove, netAbove);
      for(let [gateX, gateY] of gatesToUpdate){
        this.updateGate(gateX, gateY);
      }
    }

    if(netBelow != GROUND){
      const gatesToUpdate = this.floodFiller.floodFill(x, terminalBelow, netBelow);
      for(let [gateX, gateY] of gatesToUpdate){
        this.updateGate(gateX, gateY);
      }
    }

    if(this.query.isEmpty(x, terminalAbove)){
      this.drawWire(x, terminalAbove);
    }

    if(this.query.isEmpty(x, terminalBelow)){
      this.drawWire(x, terminalBelow);
    }

    return true;
  }

  drawButton(x, y){
    if(!canPlaceButtonHere(this.context.enneaTree, x-2, y-1)) return false;

    const net = this.query.getNextNet();

    let enneaTree = ennea.set(this.context.enneaTree, {
      type: 'button',
      net,
      state: 0
    }, {left:x-2, top:y-1, width:3, height:3});

    enneaTree = floodFill(enneaTree, net, {left:x, top:y}, 1, 0);

    const changes = ennea.diff(this.context.enneaTree, enneaTree);
    reconcile(this.context, changes);

    this.context.enneaTree = enneaTree;
    console.log(ennea.getAll(this.context.enneaTree, {top:0, left:0, width:this.context.enneaTree.size, height:this.context.enneaTree.size}));

    return true;
  }

  clearGate(x, y){
    const [netX, netY] = this.split(this.query.getNet(x, y));

    const enneaTree = ennea.clearBranch(this.context.enneaTree, {left:x, top:y});

    const gatesToUpdate = this.floodFiller.floodFill(x, y, GROUND);
    for(let [gateX, gateY] of gatesToUpdate){
      this.updateGate(gateX, gateY);
    }

    const changes = ennea.diff(this.context.enneaTree, enneaTree);
    reconcile(this.context, changes);

    this.context.gatesTexture.set(netX, netY, 0);

    this.context.enneaTree = enneaTree;
    console.log(ennea.getAll(this.context.enneaTree, {top:0, left:0, width:this.context.enneaTree.size, height:this.context.enneaTree.size}));

    return true;
  }

  clearWire(x, y){
    const net = this.query.getNet(x, y);

    const gatesToUpdateToGround = this.floodFiller.floodFill(x, y, GROUND);
    for(let [gateX, gateY] of gatesToUpdateToGround){
      this.updateGate(gateX, gateY);
    }

    const enneaTree = ennea.clearBranch(this.context.enneaTree, {left:x, top:y});
    const changes = ennea.diff(this.context.enneaTree, enneaTree);
    reconcile(this.context, changes);

    const [sx, sy] = this.query.getNetSource(net);

    const gatesToUpdateToNet = this.floodFiller.floodFill(sx, sy, net);
    for(let [gateX, gateY] of gatesToUpdateToNet){
      this.updateGate(gateX, gateY);
    }

    this.context.enneaTree = enneaTree;
    console.log(ennea.getAll(this.context.enneaTree, {top:0, left:0, width:this.context.enneaTree.size, height:this.context.enneaTree.size}));
    return true;
  }

  clearUnderpass(x, y){
    const net = this.query.getNet(x, y);

    const terminalAbove = this.query.getUnderpassTerminalAbove(x, y);
    const terminalBelow = this.query.getUnderpassTerminalBelow(x, y);

    const netAbove = this.query.getNet(x, terminalAbove);
    const netBelow = this.query.getNet(x, terminalBelow);

    const gatesToUpdateToGround = this.floodFiller.floodFill(x, y, GROUND);
    for(let [gateX, gateY] of gatesToUpdateToGround){
      this.updateGate(gateX, gateY);
    }

    this.context.mapTexture.set(x, y, EMPTY);
    this.context.netMapTexture.set(x, y, 0);

    this.context.enneaTree = ennea.clearBranch(this.context.enneaTree, {left:x, top:y});
    console.log(ennea.getAll(this.context.enneaTree, {top:0, left:0, width:this.context.enneaTree.size, height:this.context.enneaTree.size}));

    const [sx, sy] = this.query.getNetSource(net);

    const gatesToUpdateToNet = this.floodFiller.floodFill(sx, sy, net);
    for(let [gateX, gateY] of gatesToUpdateToNet){
      this.updateGate(gateX, gateY);
    }

    if(netAbove > 0){
      const gatesToUpdateToGround = this.floodFiller.floodFill(x, terminalAbove, GROUND);
      for(let [gateX, gateY] of gatesToUpdateToGround){
        this.updateGate(gateX, gateY);
      }

      const [sx, sy] = this.query.getNetSource(netAbove);

      const gatesToUpdateToNet = this.floodFiller.floodFill(sx, sy, netAbove);
      for(let [gateX, gateY] of gatesToUpdateToNet){
        this.updateGate(gateX, gateY);
      }
    }

    if(netBelow > 0){
      const gatesToUpdateToGround = this.floodFiller.floodFill(x, terminalBelow, GROUND);
      for(let [gateX, gateY] of gatesToUpdateToGround){
        this.updateGate(gateX, gateY);
      }

      const [sx, sy] = this.query.getNetSource(netBelow);

      const gatesToUpdateToNet = this.floodFiller.floodFill(sx, sy, netBelow);
      for(let [gateX, gateY] of gatesToUpdateToNet){
        this.updateGate(gateX, gateY);
      }
    }

    return true;
  }

  clearButton(x, y){
    const [netX, netY] = this.split(this.query.getNet(x, y));

    const gatesToUpdate = this.floodFiller.floodFill(x, y, GROUND);
    for(let [gateX, gateY] of gatesToUpdate){
      this.updateGate(gateX, gateY);
    }

    const enneaTree = ennea.clearBranch(this.context.enneaTree, {left:x, top:y});
    const changes = ennea.diff(this.context.enneaTree, enneaTree);
    reconcile(this.context, changes);

    this.context.enneaTree = enneaTree;
    console.log(ennea.getAll(this.context.enneaTree, {top:0, left:0, width:this.context.enneaTree.size, height:this.context.enneaTree.size}));

    this.context.gatesTexture.set(netX, netY, 0);

    return true;
  }

  clear(x, y){
    if(this.query.isGate(x, y)){
      const [gateX, gateY] = this.query.getGateOutput(x, y);
      return this.clearGate(gateX, gateY);
    }else if(this.query.isButton(x, y)){
      const [buttonX, buttonY] = this.query.getButtonOutput(x, y);
      return this.clearButton(buttonX, buttonY);
    }else if(this.query.isWire(x, y)){
      return this.clearWire(x, y);
    }else if(this.query.isUnderpass(x, y)){
      return this.clearUnderpass(x, y);
    }
  }

  draw(x, y, tool){
    if(tool == 'wire'){
      if(this.query.isWire(x, y)){
        return this.clearWire(x, y);
      }else{
        return this.drawWire(x, y);
      }
    }else if(tool == 'underpass'){
      if(this.query.isUnderpass(x, y)){
        return this.drawWire(x, y);
      }else{
        return this.drawUnderpass(x, y);
      }
    }else if(tool == 'gate'){
      return this.drawGate(x, y);
    }else if(tool == 'button'){
      return this.drawButton(x, y);
    }else{
      return false;
    }
  }

  getTileAt(x, y){
    switch(this.query.getTileType(x, y)){
      case WIRE:
        return 'wire';
      case UNDERPASS:
        return 'underpass';
      case GATE:
        return 'gate';
      case BUTTON:
        return 'button';
      case EMPTY:
        if(this.query.isGate(x, y)){
          return 'gate';
        }else if(this.query.isButton(x, y)){
          return 'button';
        }else{
          return 'empty';
        }
      default:
        return 'empty';
    }
  }

  longPress(x, y){
    switch(this.query.getTileType(x, y)){
      case WIRE:
        this.drawUnderpass(x, y);
        return true;
      case UNDERPASS:
        this.drawWire(x, y);
        return true;
      case EMPTY:
        if(this.query.isGate(x, y)){
          const [gateX, gateY] = this.query.getGateOutput(x, y);
          this.clearGate(gateX, gateY);
          return true;
        }else if(this.query.isButton(x, y)){
          const [buttonX, buttonY] = this.query.getButtonOutput(x, y);
          this.clearButton(buttonX, buttonY);
          return true;
        }else{
          return false;
        }
      default:
        return false;
    }
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

  updateGate(x, y){
    const inputA = this.query.getNet(x-3, y-1);
    const inputB = this.query.getNet(x-3, y+1);
    this.setGateInput(x, y, inputA, inputB);
  }

  getGateInput(x, y){
    const [outputX, outputY] = this.split(this.query.getNet(x, y));
    return this.context.gatesTexture.get(outputX, outputY);
  }

  setGateInput(x, y, a, b){
    const [outputX, outputY] = this.split(this.query.getNet(x, y));
    this.context.gatesTexture.set(outputX, outputY, (a<<16) | (b<<0));
  }

  toggleButton(x, y){
    const [buttonX, buttonY] = this.query.getButtonOutput(x, y);
    const [outputX, outputY] = this.split(this.query.getNet(buttonX, buttonY));
    const button = this.context.gatesTexture.get(outputX, outputY);
    this.context.gatesTexture.set(outputX, outputY, button === 0 ? ((1<<16) | (1<<0)) : 0);
  }

  split(v){
    return [
      (v>>0)&0xff,
      (v>>8)&0xff
    ];
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