import ContextQuery from './ContextQuery.js';
import Validator from './Validator.js';
import FloodFiller from './FloodFiller.js';
import {EMPTY, WIRE, GATE, UNDERPASS} from './tileConstants.js';

const GROUND = 0;

export default class Editor{
  constructor(context){
    this.context = context;
    this.query = new ContextQuery(this.context);
    this.floodFiller = new FloodFiller(this.context, this.query);
    this.validate = new Validator(this.query);
  }

  drawWire(x, y){
    if(!this.validate.canPlaceWireHere(x, y)) return;

    const neighbouringNets = this.query.getNeighbouringNets(x, y, WIRE);

    this.context.mapTexture.set(x, y, WIRE);
    if(neighbouringNets.length == 1){
      const net = neighbouringNets[0];
      const gatesToUpdate = this.floodFiller.floodFill(x, y, net);
      for(let [gateX, gateY] of gatesToUpdate){
        this.updateGate(gateX, gateY);
      }
    }

    this.context.mapTexture.update();
    this.context.netMapTexture.update();
    this.context.gatesTexture.update();
  }

  drawGate(x, y){
    if(!this.validate.canPlaceGateHere(x, y)) return;

    const nextNet = this.query.getNextNet();

    for(let cy=y-1; cy<=y+1; cy++){
      for(let cx=x-3; cx<=x; cx++){
        this.context.mapTexture.set(cx, cy, EMPTY);
        this.context.netMapTexture.set(cx, cy, GROUND);
      }
    }

    this.context.mapTexture.set(x, y, GATE);
    this.context.netMapTexture.set16(x, y, nextNet);

    this.context.netMapTexture.set16(x-3, y-1, this.query.getNet(x-4, y-1));
    this.context.netMapTexture.set16(x-3, y+1, this.query.getNet(x-4, y+1));

    this.updateGate(x, y);

    const gatesToUpdate = this.floodFiller.floodFill(x, y, nextNet);
    for(let [gateX, gateY] of gatesToUpdate){
      this.updateGate(gateX, gateY);
    }

    this.context.netMapTexture.update();
    this.context.gatesTexture.update();
    this.context.mapTexture.update();
  }

  drawUnderpass(x, y){
    if(!this.validate.canPlaceUnderpassHere(x, y)) return;

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

    this.context.mapTexture.update();
    this.context.netMapTexture.update();
    this.context.gatesTexture.update();
  }

  clearGate(x, y){
    const [netX, netY] = this.split(this.query.getNet(x, y));

    const gatesToUpdate = this.floodFiller.floodFill(x, y, GROUND);
    for(let [gateX, gateY] of gatesToUpdate){
      this.updateGate(gateX, gateY);
    }

    this.context.mapTexture.set(x, y, EMPTY);
    this.context.netMapTexture.set16(x, y, GROUND);

    this.context.gatesTexture.set(netY, netX, 0, 0);
    this.context.gatesTexture.set(netY, netX, 1, 0);
    this.context.gatesTexture.set(netY, netX, 2, 0);
    this.context.gatesTexture.set(netY, netX, 3, 0);

    this.context.netMapTexture.update();
    this.context.gatesTexture.update();
    this.context.mapTexture.update();
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

    this.context.mapTexture.update();
    this.context.netMapTexture.update();
    this.context.gatesTexture.update();
  }

  clear(x, y){
    if(this.query.isGate(x, y)){
      const [gateX, gateY] = this.query.getGateOutput(x, y);
      this.clearGate(gateX, gateY);
    }else if(this.query.isWire(x, y)){
      this.clearWire(x, y);
    }
  }

  updateGate(x, y){
    const [outputX, outputY] = this.split(this.query.getNet(x, y));
    const [inputA0, inputA1] = this.split(this.query.getNet(x-3, y-1));
    const [inputB0, inputB1] = this.split(this.query.getNet(x-3, y+1));
    this.context.gatesTexture.map.set(outputY, outputX, 0, inputA0);
    this.context.gatesTexture.map.set(outputY, outputX, 1, inputA1);
    this.context.gatesTexture.map.set(outputY, outputX, 2, inputB0);
    this.context.gatesTexture.map.set(outputY, outputX, 3, inputB1);
  }

  split(v){
    return [
      (v>>0)&0xff,
      (v>>8)&0xff
    ];
  }
}