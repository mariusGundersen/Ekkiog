import { getIterator } from 'ennea-tree';
import { TreeNode, Box } from 'ekkiog-editing';
import { EventEmitter } from 'events';

import {
  GlobalActions
} from '../actions';

import Engine from '../engines/Engine';
import Perspective from '../Perspective';

interface GlobalSharedState {
  readonly emitter : EventEmitter,
  readonly perspective : Perspective
}

export interface GlobalStateInitialized extends GlobalSharedState {
  readonly initialized : true
  readonly engine : Engine
  readonly emitter : EventEmitter,
  readonly perspective : Perspective
}

export interface GlobalStateUninitialized extends GlobalSharedState {
  readonly initialized : false
}

export type GlobalState = GlobalStateUninitialized | GlobalStateInitialized;

export default function global(state : GlobalState = {
  initialized: false,
  emitter: new EventEmitter(),
  perspective: new Perspective()
}, action : GlobalActions) : GlobalState {
  switch(action.type){
    case 'gl':
      if(state.initialized) return state;
      return {
        ...state,
        initialized: true,
        engine: new Engine(action.gl)
      };
    case 'set-forest':
      state.perspective.reset(calculateBoundingBox(action.forest.enneaTree));
      return state;
    case 'resize':
      if(!state.initialized) return state;
      state.engine.setViewport(action.pixelWidth, action.pixelHeight);
    default:
      return state;
  }
}

function calculateBoundingBox(tree : TreeNode) : Box {
  const box = {
    top: tree.size,
    left: tree.size,
    right: 0,
    bottom: 0
  };

  for(const node of getIterator(tree, {top: 0, left: 0, width: tree.size, height: tree.size})){
    box.top = Math.min(box.top, node.top-2);
    box.left = Math.min(box.left, node.left-2);
    box.right = Math.max(box.right, node.left+node.width+2);
    box.bottom = Math.max(box.bottom, node.top+node.height+2);
  }

  if(box.top > box.bottom){
    return {
      top: 56,
      left: 56,
      right: 72,
      bottom: 72
    }
  }

  return box;
}