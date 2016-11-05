import * as ennea from 'ennea-tree';

const GROUND = 0;

export default function(enneaTree, x, y, dx, dy){
  const tile = ennea.get(enneaTree, y, x);
  if(!tile) return GROUND;

  switch(tile.data.type){
    case 'wire':
      return tile.data.net;
    case 'gate':
      return getGateNet(tile, dx, dy);
    case 'underpass':
      return getUnderpassNet(tile, dx, dy);
    case 'button':
      return getButtonNet(tile);
  }
}

export function getGateNet(gate, dx, dy){
  if(gate.top === 1 && gate.left === 3){
    return gate.data.net;
  }else if(gate.top === 0 && gate.left === 0 && dx === 1 && dy === 0){
    return gate.data.inputA.net;
  }else if(gate.top === 2 && gate.left === 0 && dx === 1 && dy === 0){
    return gate.data.inputB.net;
  }else{
    return GROUND;
  }
}

export function getUnderpassNet(underpass, dx, dy){
  if(dx !== 0 && dy === 0){
    return underpass.data.net;
  }else{
    return GROUND;
  }
}

export function getButtonNet(button){
  if(button.top === 1 && button.left === 2){
    return button.data.net;
  }else{
    return GROUND;
  }
}