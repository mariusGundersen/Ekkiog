import * as ennea from 'ennea-tree';
import { deallocate } from 'buddy-tree';

import {
  GATE,
  BUTTON,
  COMPONENT,
  GROUND
} from '../constants';

import floodFill from '../flooding/floodFill';

import { Forest, Item } from '../types';

import { FloodSource, FloodSourceComponent } from '../flooding/types';

export default function clear(forest : Forest, x : number, y : number) : Forest {
  let {tree : enneaTree, cleared} = ennea.clear(forest.enneaTree, {left:x, top:y});

  enneaTree = floodFill(enneaTree, ...cleared.reduce((a, b) => a.concat(...clearBox(b)), [] as FloodSource[]));

  const buddyTree = cleared.map(getNetSource)
    .filter(net => net > 1)
    .reduce(deallocate, forest.buddyTree);

  return {
    enneaTree,
    buddyTree
  };
}

function* clearBox(box : ennea.AreaData<Item>){
  if(!box.data){
    return;
  }else if(box.data.type === COMPONENT){
    for(const output of box.data.outputs){
      yield {
        left: box.left + output.x,
        top: box.top + output.y,
        type: box.data.type,
        net: GROUND
      } as FloodSourceComponent;
    }
  }

  return yield {
    left: box.left,
    top: box.top,
    type: box.data.type,
    net: GROUND
  } as FloodSource;
}

function getNetSource(box : ennea.AreaData<Item>){
  if(box.data == null){
    return -1;
  }

  switch(box.data.type){
    case GATE:
    case BUTTON:
      return box.data.net;
    case COMPONENT:
      return box.data.nets[0]
    default:
      return -1;
  }
}