import unique from 'array-unique';

import ContextQuery from './ContextQuery.js';
import floodFill from './floodFill.js';

const EMPTY = 0;
const WIRE = 1;
const GATE = 2;

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
    if(this.query.isGate(x, y)) return;

    this.context.mapTexture.set(x, y, GATE);
    this.context.mapTexture.update();
  }

  clear(x, y){
    if(this.query.isGate(x, y)) return;

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