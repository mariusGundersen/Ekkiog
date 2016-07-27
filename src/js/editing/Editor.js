import unique from 'array-unique';

import ContextQuery from './ContextQuery.js';
import floodFill from './floodFill.js';

const EMPTY = 0;
const WIRE = 1;
const GATE = 2;
const UNDERPASS = 3;

const GROUND = 0;

export default class Editor{
  constructor(context){
    this.context = context;
    this.query = new ContextQuery(context);
  }

  drawWire(x, y){
    if(this.query.isGate(x, y)) return;

    const neighbouringNets = this.getNeighbouringNets(x, y);
    if(neighbouringNets.length > 1) return;

    this.context.mapTexture.set(x, y, WIRE);
    if(neighbouringNets.length == 1){
      const net = neighbouringNets[0];
      floodFill(x, y, this.context.width, this.context.height,
        (x, y) => (this.query.isWire(x, y) || this.query.isGateInput(x, y)),
        (x, y) => {
          this.context.netMapTexture.set(x, y, net);
          if(this.query.isGateInput(x, y)){
            this.updateGate(...this.query.getGateForInput(x, y));
          }
        });
    }

    this.context.mapTexture.update();
    this.context.netMapTexture.update();
    this.context.gatesTexture.update();
  }

  drawGate(x, y){
    if(!this.query.canPlaceGateHere(x, y)) return;
    if(!this.query.isGroundNet(x+1, y)) return;

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

    floodFill(x, y, this.context.width, this.context.height,
      (x, y) => (this.query.isWire(x, y) || this.query.isGateInput(x, y) || this.query.isGateOutput(x, y)),
      (x, y) => {
        this.context.netMapTexture.set(x, y, nextNet);
        if(this.query.isGateInput(x, y)){
          this.updateGate(...this.query.getGateForInput(x, y));
        }
      });

    this.context.netMapTexture.update();
    this.context.gatesTexture.update();
    this.context.mapTexture.update();
  }

  drawUnderpass(x, y){
    if(this.query.isGate(x, y)) return;

    this.context.mapTexture.set(x, y, UNDERPASS);
  }

  clearGate(x, y){
    const [netX, netY] = this.split(this.query.getNet(x, y));

    floodFill(x, y, this.context.width, this.context.height,
      (x, y) => (this.query.isWire(x, y) || this.query.isGateInput(x, y) || this.query.isGateOutput(x, y)),
      (x, y) => {
        this.context.netMapTexture.set(x, y, GROUND);
        if(this.query.isGateInput(x, y)){
          this.updateGate(...this.query.getGateForInput(x, y));
        }
      });

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

    floodFill(x, y, this.context.width, this.context.height,
      (x, y) => (this.query.isWire(x, y) || this.query.isGateInput(x, y)),
      (x, y) => {
        this.context.netMapTexture.set(x, y, GROUND);
        if(this.query.isGateInput(x, y)){
          this.updateGate(...this.query.getGateForInput(x, y));
        }
      });

    this.context.mapTexture.set(x, y, EMPTY);
    this.context.netMapTexture.set(x, y, 0);

    const [sx, sy] = this.query.getNetSource(net);

    floodFill(sx, sy, this.context.width, this.context.height,
      (x, y) => (this.query.isWire(x, y) || this.query.isGateInput(x, y) || this.query.isGateOutput(x, y)),
      (x, y) => {
        this.context.netMapTexture.set(x, y, net);
        if(this.query.isGateInput(x, y)){
          this.updateGate(...this.query.getGateForInput(x, y));
        }
      });

    this.context.mapTexture.update();
    this.context.netMapTexture.update();
    this.context.gatesTexture.update();
  }

  clear(x, y){
    if(this.query.isGate(x, y)){
      const [gateX, gateY] = this.query.getGateOutput(x, y);
      this.clearGate(gateX, gateY);
    }else if(this.query.isWire(x, y)){
      this.cloarWire(x, y);
    }
  }

  updateGate(x, y){
    console.log('updateGate', x, y);
    const [outputX, outputY] = this.split(this.query.getNet(x, y));
    const [inputA0, inputA1] = this.split(this.query.getNet(x-3, y-1));
    const [inputB0, inputB1] = this.split(this.query.getNet(x-3, y+1));
    console.log('gateA', inputA0, inputA1);
    console.log('gateB', inputB0, inputB1);
    console.log('gate', outputX, outputY);
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

  getNeighbouringNets(x, y){
    const nets = [
      this.query.getNet(x+1, y+0),
      this.query.getNet(x-1, y+0),
      this.query.getNet(x+0, y+1),
      this.query.getNet(x+0, y-1),
    ].filter(net => net != 0);

    return unique(nets);
  }
}