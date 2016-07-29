import unique from 'array-unique';

import {EMPTY, WIRE, GATE, UNDERPASS} from './tileConstants.js';

export default class ContextQuery{
  constructor(context){
    this.context = context;
  }

  getTileType(x, y){
    return this.context.mapTexture.map.get(y, x, 0);
  }

  isWire(x, y){
    return this.context.mapTexture.map.get(y, x, 0) === WIRE;
  }

  isUnderpass(x, y){
    return this.context.mapTexture.map.get(y, x, 0) === UNDERPASS;
  }

  isGate(tx, ty){
    for(let y=ty-1; y<=ty+1; y++){
      for(let x=tx; x<=tx+3; x++){
        if(this.isGateOutput(x, y)) return true;
      }
    }
    return false;
  }

  canPlaceGateHere(tx, ty){
    for(let y=ty-1; y<=ty+1; y++){
      for(let x=tx-3; x<=tx; x++){
        if(this.isGate(x, y)) return false;
      }
    }
    return true;
  }

  isGateInput(x, y){
    return this.isGateOutput(x+3, y+1)
        || this.isGateOutput(x+3, y-1);
  }

  isGateOutput(x, y){
    return this.context.mapTexture.map.get(y, x, 0) === GATE;
  }

  isGroundNet(x, y){
    return this.context.netMapTexture.map.get(y, x, 0) === 0
        && this.context.netMapTexture.map.get(y, x, 1) === 0;
  }

  getNet(x, y){
    return (this.context.netMapTexture.map.get(y, x, 0)<<0)
         | (this.context.netMapTexture.map.get(y, x, 1)<<8);
  }

  getNetSource(net){
    for(let y=0; y<this.context.height; y++){
      for(let x=0; x<this.context.width; x++){
        if(this.isGateOutput(x, y) && this.getNet(x, y) == net){
          return [x, y];
        }
      }
    }

    return [-1, -1];
  }

  getGateForInput(x, y){
    if(this.isGateOutput(x+3, y+1)){
      return [x+3, y+1];
    }else if(this.isGateOutput(x+3, y-1)){
      return [x+3, y-1];
    }else{
      return null;
    }
  }

  getGateOutput(tx, ty){
    for(let y=ty-1; y<=ty+1; y++){
      for(let x=tx; x<=tx+3; x++){
        if(this.isGateOutput(x, y)) return [x, y];
      }
    }
    return null;
  }

  getNextNet(){
    const nets = [];
    for(let y=0; y<this.context.height; y++){
      for(let x=0; x<this.context.width; x++){
        if(this.isGateOutput(x, y)){
          nets.push(this.getNet(x, y));
        }
      }
    }

    if(nets.length === 0){
      return 1;
    }

    const sortedNets = nets.sort((a,b) => a-b);
    for(let i=1; i<sortedNets.length; i++){
      if(sortedNets[i] - sortedNets[i-1] > 1){
        return sortedNets[i-1] + 1;
      }
    }

    return sortedNets[sortedNets.length-1]+1;
  }

  getNeighbouringNets(x, y, type){
    const searchDirections = [...this.getSearchDirections(x, y, type)];
    const nets = searchDirections
      .map(([x, y]) => this.getNet(x, y))
      .filter(net => net !=0);
    return unique(nets);
  }

  *getSearchDirections(x, y, type){
    const w = this.context.width;
    const h = this.context.height;
    if(type == WIRE){
      if(x > 0 && (this.isWire(x-1, y) || this.isUnderpass(x-1, y) || this.isGateOutput(x-1, y))){
        yield [x-1, y];
      }
      if(x+1 < w && (this.isWire(x+1, y) || this.isUnderpass(x+1, y) || this.isGateInput(x+1, y))){
        yield [x+1, y];
      }
      if(y > 0 && this.isWire(x, y-1)){
        yield [x, y-1];
      }
      if(y > 1 && this.isUnderpass(x, y-1)){
        const terminalY = this.getUnderpassTerminalAbove(x, y-1);
        if(this.isWire(x, terminalY)){
          yield [x, terminalY];
        }
      }
      if(y+1 < h && this.isWire(x, y+1)){
        yield [x, y+1];
      }
      if(y+2 < h && this.isUnderpass(x, y+1)){
        const terminalY = this.getUnderpassTerminalBelow(x, y+1);
        if(this.isWire(x, terminalY)){
          yield [x, terminalY];
        }
      }
    }else if(type == UNDERPASS){
      if(x > 0 && (this.isWire(x-1, y) || this.isUnderpass(x-1, y) || this.isGateOutput(x-1, y))){
        yield [x-1, y];
      }
      if(x+1 < w && (this.isWire(x+1, y) || this.isUnderpass(x+1, y) || this.isGateInput(x+1, y))){
        yield [x+1, y];
      }
    }else if(type == GATE){
      if(x+1 < w && (this.isWire(x+1, y) || this.isUnderpass(x+1, y) || this.isGateInput(x+1, y))){
        yield [x+1, y];
      }
    }
  }

  getUnderpassTerminalAbove(x, y){
    while(y-1 > 0 && this.isUnderpass(x, y)){
      y--;
    }

    return y;
  }

  getUnderpassTerminalBelow(x, y){
    const h = this.context.height;

    while(y+1 < h && this.isUnderpass(x, y)){
      y++;
    }

    return y;
  }
}