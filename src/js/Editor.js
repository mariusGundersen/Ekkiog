const EMPTY = 0;
const WIRE = 1;
const GATE = 2;

export default class Editor{
  constructor(context){
    this.context = context;
  }

  drawWire(x, y){
    if(this.isGate(x, y)) return;

    this.context.mapTexture.toggle(x, y);
    this.context.mapTexture.update();
  }

  isGate(tx, ty){
    for(let y=ty-1; y<=ty+1; y++){
      for(let x=tx; x<=tx+3; x++){
        if(this.context.mapTexture.map.get(y, x, 0) == GATE) return true;
      }
    }
    return false;
  }
}