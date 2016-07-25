import unique from 'array-unique';

import floodFill from './floodFill.js';

const EMPTY = 0;
const WIRE = 1;
const GATE = 2;

export default class Editor{
  constructor(context){
    this.context = context;
  }

  drawWire(x, y){
    if(this.isGate(x, y)) return;

    const neighbouringNets = this.getNeighbouringNets(x, y);
    if(neighbouringNets.length > 1) return;

    this.context.mapTexture.set(x, y, WIRE);
    if(neighbouringNets.length == 1){
      const net = neighbouringNets[0];
      floodFill(x, y,
        (x, y) => this.isWire(x, y) && this.context.netMapTexture.get16(x, y) === 0,
        (x, y) => this.context.netMapTexture.set(x, y, net));
    }

    this.context.mapTexture.update();
    this.context.netMapTexture.update();
  }

  drawGate(x, y){
    if(this.isGate(x, y)) return;

    this.context.mapTexture.set(x, y, GATE);
    this.context.mapTexture.update();
  }

  clear(x, y){
    if(this.isGate(x, y)) return;

    this.context.mapTexture.set(x, y, EMPTY);
    this.context.netMapTexture.set(x, y, 0);

    this.context.mapTexture.update();
    this.context.netMapTexture.update();
  }

  isWire(x, y){
    return this.context.mapTexture.get(x, y) == WIRE;
  }

  isGate(tx, ty){
    for(let y=ty-1; y<=ty+1; y++){
      for(let x=tx; x<=tx+3; x++){
        if(this.context.mapTexture.map.get(y, x, 0) == GATE) return true;
      }
    }
    return false;
  }

  getNeighbouringNets(x, y){
    const nets = [
      this.context.netMapTexture.get16(x+1, y+0),
      this.context.netMapTexture.get16(x-1, y+0),
      this.context.netMapTexture.get16(x+0, y+1),
      this.context.netMapTexture.get16(x+0, y-1),
    ].filter(net => net != 0);

    return unique(nets);
  }
}