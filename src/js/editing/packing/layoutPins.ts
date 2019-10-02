import {
  IHavePosition
} from '../types';

export type Pin = {
  readonly x : number,
  readonly y : number,
  readonly dx : number,
  readonly dy : number,
  readonly net : number,
  readonly name : string
};

export type PinLayout = {
  readonly width : number,
  readonly height : number,
  readonly inputs : Pin[],
  readonly outputs : Pin[]
}

export default function layoutPins(
  sources : Pin[],
  drains : Pin[])
  : PinLayout {
  const sourcesUps = sources.filter(toDown);
  const sourcesLefts = sources.filter(toRight);
  const sourcesRights = sources.filter(toLeft);
  const sourcesDowns = sources.filter(toUp);

  const drainsUps = drains.filter(toUp);
  const drainsLefts = drains.filter(toLeft);
  const drainsRights = drains.filter(toRight);
  const drainsDowns = drains.filter(toDown);

  const ups = [...sourcesUps, ...drainsUps].sort(byX);
  const lefts = [...sourcesLefts, ...drainsLefts].sort(byY);
  const rights = [...sourcesRights, ...drainsRights].sort(byY);
  const downs = [...sourcesDowns, ...drainsDowns].sort(byX);

  const width = Math.max(3, ups.length*2 + 1, downs.length*2 + 1);
  const height = Math.max(3, lefts.length*2 + 1, rights.length*2 + 1);

  const inputs = sources
    .map(pin => ({
      ...pin,
      ...getPos(pin)
    }));

  const outputs = drains
    .map(pin => ({
      ...pin,
      ...getPos(pin)
    }));

  return {
    width,
    height,
    inputs,
    outputs
  };

  function getPos(pin : Pin) : IHavePosition {
    let index = ups.indexOf(pin);
    if(index >= 0){
      return {
        x: ((width-1)>>1) - ups.length + index*2 + 1,
        y: 0
      };
    }
    index = downs.indexOf(pin);
    if(index >= 0){
      return {
        x: ((width-1)>>1) - downs.length + index*2 + 1,
        y: height - 1
      };
    }
    index = lefts.indexOf(pin);
    if(index >= 0){
      return {
        x: 0,
        y: ((height-1)>>1) - lefts.length + index*2 + 1
      };
    }
    index = rights.indexOf(pin);
    if(index >= 0){
      return {
        x: width - 1,
        y: ((height-1)>>1) - rights.length + index*2 + 1
      };
    }

    return {
      x: 0,
      y: 0
    };
  }
}

function toLeft({dx, dy} : Pin){
  return dx === -1 && dy === 0;
}
function toRight({dx, dy} : Pin){
  return dx === 1 && dy === 0;
}
function toUp({dx, dy} : Pin){
  return dx === 0 && dy === -1;
}
function toDown({dx, dy} : Pin){
  return dx === 0 && dy === 1;
}

function byX(a : Pin, b : Pin){
  return a.x - b.x;
}
function byY(a : Pin, b : Pin){
  return a.y - b.y;
}