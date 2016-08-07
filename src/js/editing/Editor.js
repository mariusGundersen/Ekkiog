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

const GROUND = 0;

export default class Editor{
  constructor(context){
    this.context = context;
    this.query = new ContextQuery(this.context);
    this.floodFiller = new FloodFiller(this.context, this.query);
    this.validate = new Validator(this.query);
  }

  drawWire(x, y){
    if(!this.validate.canPlaceWireHere(x, y)) return false;

    const neighbouringNets = this.query.getNeighbouringNets(x, y, WIRE);

    this.context.mapTexture.set(x, y, WIRE);
    if(neighbouringNets.length == 1){
      const net = neighbouringNets[0];
      const gatesToUpdate = this.floodFiller.floodFill(x, y, net);
      for(let [gateX, gateY] of gatesToUpdate){
        this.updateGate(gateX, gateY);
      }
    }

    return true;
  }

  drawGate(x, y){
    if(!this.validate.canPlaceGateHere(x, y)) return false;

    const nextNet = this.query.getNextNet();

    this.clear(x, y);
    for(let cy=y-1; cy<=y+1; cy++){
      for(let cx=x-3; cx<x; cx++){
        this.clear(cx, cy);
      }
    }

    this.context.mapTexture.set(x, y, GATE);
    this.context.netMapTexture.set(x, y, nextNet);

    this.context.netMapTexture.set(x-3, y-1, this.query.getNet(x-4, y-1));
    this.context.netMapTexture.set(x-3, y+1, this.query.getNet(x-4, y+1));

    this.updateGate(x, y);

    const gatesToUpdate = this.floodFiller.floodFill(x, y, nextNet);
    for(let [gateX, gateY] of gatesToUpdate){
      this.updateGate(gateX, gateY);
    }

    return true;
  }

  drawUnderpass(x, y){
    if(!this.validate.canPlaceUnderpassHere(x, y)) return false;

    if(this.query.isWire(x, y)){
      this.clearWire(x, y);
    }

    const neighbouringNets = this.query.getNeighbouringNets(x, y, UNDERPASS);

    this.context.mapTexture.set(x, y, UNDERPASS);
    if(neighbouringNets.length == 1){
      const net = neighbouringNets[0];
      const gatesToUpdate = this.floodFiller.floodFill(x, y, net);
      for(let [gateX, gateY] of gatesToUpdate){
        this.updateGate(gateX, gateY);
      }
    }

    const terminalAbove = this.query.getUnderpassTerminalAbove(x, y);
    const terminalBelow = this.query.getUnderpassTerminalBelow(x, y);
    const netAbove = this.query.getNet(x, terminalAbove);
    const netBelow = this.query.getNet(x, terminalBelow);

    if(netAbove > 0){
      const gatesToUpdate = this.floodFiller.floodFill(x, terminalAbove, netAbove);
      for(let [gateX, gateY] of gatesToUpdate){
        this.updateGate(gateX, gateY);
      }
    }

    if(netBelow > 0){
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
    if(!this.validate.canPlaceButtonHere(x, y)) return false;

    const nextNet = this.query.getNextNet();

    for(let cy=y-1; cy<=y+1; cy++){
      for(let cx=x-2; cx<=x; cx++){
        this.clear(cx, cy);
      }
    }

    this.context.mapTexture.set(x, y, BUTTON);
    this.context.netMapTexture.set(x, y, nextNet);
    this.context.netMapTexture.set(x-1, y, nextNet);
    const [netX, netY] = this.split(nextNet);
    this.context.gatesTexture.set(netX, netY, (1<<16) | (1<<0));

    const gatesToUpdate = this.floodFiller.floodFill(x, y, nextNet);
    for(let [gateX, gateY] of gatesToUpdate){
      this.updateGate(gateX, gateY);
    }

    return true;
  }

  clearGate(x, y){
    const [netX, netY] = this.split(this.query.getNet(x, y));

    const gatesToUpdate = this.floodFiller.floodFill(x, y, GROUND);
    for(let [gateX, gateY] of gatesToUpdate){
      this.updateGate(gateX, gateY);
    }

    this.context.mapTexture.set(x, y, EMPTY);
    this.context.netMapTexture.set(x, y, GROUND);

    this.context.gatesTexture.set(netX, netY, 0);

    return true;
  }

  clearWire(x, y){
    const net = this.query.getNet(x, y);

    const gatesToUpdateToGround = this.floodFiller.floodFill(x, y, GROUND);
    for(let [gateX, gateY] of gatesToUpdateToGround){
      this.updateGate(gateX, gateY);
    }

    this.context.mapTexture.set(x, y, EMPTY);
    this.context.netMapTexture.set(x, y, 0);

    const [sx, sy] = this.query.getNetSource(net);

    const gatesToUpdateToNet = this.floodFiller.floodFill(sx, sy, net);
    for(let [gateX, gateY] of gatesToUpdateToNet){
      this.updateGate(gateX, gateY);
    }

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

    this.context.mapTexture.set(x, y, EMPTY);
    this.context.netMapTexture.set(x, y, GROUND);

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

  edit(x, y, tool){
    if(tool == 'wire'){
      if(this.query.isWire(x, y)){
        return this.clearWire(x, y);
      }else{
        return this.drawWire(x, y);
      }
    }else if(tool == 'underpass'){
      return this.drawUnderpass(x, y);
    }else if(tool == 'gate'){
      return this.drawGate(x, y);
    }else if(tool == 'button'){
      return this.drawButton(x, y);
    }else{
      return this.clear(x, y);
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