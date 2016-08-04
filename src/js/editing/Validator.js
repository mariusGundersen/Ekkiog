import {WIRE, GATE, UNDERPASS} from './tileConstants.js';

export default class Validator{
  constructor(contextQuery){
    this.query = contextQuery;
  }

  canPlaceWireHere(x, y){
    if(this.query.isGate(x, y)) return false;

    const neighbouringNets = this.query.getNeighbouringNets(x, y, WIRE);
    if(neighbouringNets.length > 1) return false;

    return true;
  }

  canPlaceGateHere(x, y){
    if(!this.query.canPlaceGateHere(x, y)) return false;
    if(!this.query.isGroundNet(x+1, y)) return false;

    return true;
  }

  canPlaceUnderpassHere(x, y){
    if(this.query.isGate(x, y)) return false;

    const neighbouringNets = this.query.getNeighbouringNets(x, y, UNDERPASS);
    if(neighbouringNets.length > 1) return false;

    const terminalNets = this.query.getUnderpassTerminalNets(x, y);
    if(terminalNets.length > 1) return false;

    return true;
  }

  canPlaceButtonHere(x, y){
    if(!this.query.canPlaceButtonHere(x, y)) return false;
    if(!this.query.isGroundNet(x+1, y)) return false;

    return true;
  }
}