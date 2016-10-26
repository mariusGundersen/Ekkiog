export function isWire(tile){
  return tile && tile.data && tile.data.type === 'wire';
}

export function isUnderpass(tile){
  return tile && tile.data && tile.data.type === 'underpass';
}

export function isGateOutput(tile){
  return tile && tile.data && tile.data.type === 'gate' && tile.left === 3 && tile.top === 1;
}

export function isGateInput(tile){
  return tile && tile.data && tile.data.type === 'gate' && tile.left === 0 && (tile.top === 0 || tile.top === 2);
}

export function isButtonOutput(tile){
  return tile && tile.data && tile.data.type === 'button' && tile.left === 2 && tile.top === 1;
}