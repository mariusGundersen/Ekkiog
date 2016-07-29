import ContextQuery from './ContextQuery.js';
import Validator from './Validator.js';
import floodFill from './floodFill.js';
import {EMPTY, WIRE, GATE, UNDERPASS} from './tileConstants.js';

const GROUND = 0;

export default class Editor{
  constructor(context){
    this.context = context;
    this.query = new ContextQuery(context);
    this.validate = new Validator(this.query);
  }

  drawWire(x, y){
    if(!this.validate.canPlaceWireHere(x, y)) return;

    const neighbouringNets = this.query.getNeighbouringNets(x, y, WIRE);

    this.context.mapTexture.set(x, y, WIRE);
    if(neighbouringNets.length == 1){
      const net = neighbouringNets[0];
      floodFill(x, y, this.context.width, this.context.height,
        (x, y) => this.query.getSearchDirections(x, y, this.query.getTileType(x, y)),
        (x, y) => {
          if(this.query.isGateOutput(x, y)) return;
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

    floodFill(x, y, this.context.width, this.context.height,
      (x, y) => this.query.getSearchDirections(x, y, this.query.getTileType(x, y)),
      (x, y) => {
        if(this.query.isGateOutput(x, y)) return;
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
    if(!this.validate.canPlaceUnderpassHere(x, y)) return;

    const neighbouringNets = this.query.getNeighbouringNets(x, y, UNDERPASS);

    this.context.mapTexture.set(x, y, UNDERPASS);
    if(neighbouringNets.length == 1){
      const net = neighbouringNets[0];
      floodFill(x, y, this.context.width, this.context.height,
        (x, y) => this.query.getSearchDirections(x, y, this.query.getTileType(x, y)),
        (x, y) => {
          if(this.query.isGateOutput(x, y)) return;
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

  clearGate(x, y){
    const [netX, netY] = this.split(this.query.getNet(x, y));

    floodFill(x, y, this.context.width, this.context.height,
      (x, y) => this.query.getSearchDirections(x, y, this.query.getTileType(x, y)),
      (x, y) => {
        if(this.query.isGateOutput(x, y)) return;
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
    console.log('---------');
    console.log('clearWire', x, y);
    const net = this.query.getNet(x, y);

    floodFill(x, y, this.context.width, this.context.height,
      (x, y) => this.query.getSearchDirections(x, y, this.query.getTileType(x, y)),
      (x, y) => {
        if(this.query.isGateOutput(x, y)) return;
        this.context.netMapTexture.set(x, y, GROUND);
        if(this.query.isGateInput(x, y)){
          console.log('clearWire', x, y, 'GROUND');
          this.updateGate(...this.query.getGateForInput(x, y));
        }
      });

    this.context.mapTexture.set(x, y, EMPTY);
    this.context.netMapTexture.set(x, y, 0);

    const [sx, sy] = this.query.getNetSource(net);
    console.log('clearWire - source (', net, ')', sx, sy);

    floodFill(sx, sy, this.context.width, this.context.height,
      (x, y) => this.query.getSearchDirections(x, y, this.query.getTileType(x, y)),
      (x, y) => {
        if(this.query.isGateOutput(x, y)) return;
        this.context.netMapTexture.set(x, y, net);
        if(this.query.isGateInput(x, y)){
          console.log('clearWire', x, y, 'net:', net);
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
      //this.clearWire(x, y);
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
}