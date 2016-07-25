
const EMPTY = 0;
const WIRE = 1;
const GATE = 2;

export default class ContextQuery{
  constructor(context){
    this.context = context;
  }

  isWire(x, y){
    return this.context.mapTexture.map.get(y, x, 0) === WIRE;
  }

  isGate(tx, ty){
    for(let y=ty-1; y<=ty+1; y++){
      for(let x=tx; x<=tx+3; x++){
        if(this.isGateOutput(x, y)) return true;
      }
    }
    return false;
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
    for(let y=0; y<=this.context.height; y++){
      for(let x=0; x<=this.context.width; x++){
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
}