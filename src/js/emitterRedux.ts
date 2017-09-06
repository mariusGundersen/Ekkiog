import { EventEmitter } from 'events';
import {
  get as getTileAt,
  getIterator,
  AreaData
} from 'ennea-tree';

import {
  getTypeAt,
  isEmpty,
  Forest,
  BUTTON,
  GATE,
  LIGHT,
  COMPONENT,
  Component,
  clear,
  packageComponent,
  drawComponent,
  CompiledComponent
} from 'ekkiog-editing';

import {
  Dispatch,
  Store
} from 'react-redux';

import {
  tapTile,
  loadContextMenu,
  abortLoadContextMenu,
  showContextMenu,
  setOkCancelMenuValid,
  moveSelection,
  setForest,
  pushContext,
  popContext,
  insertComponentPackages,
  insertMovableItem,
  save
} from './actions';
import { State } from './reduce';
import {
  TAP,
  DOUBLE_TAP,
  SHOW_CONTEXT_MENU,
  LOAD_CONTEXT_MENU,
  ABORT_LOAD_CONTEXT_MENU,
  MOVE_SELECTION
} from './events';

import * as storage from './storage';
import Engine from './engines/Engine';

type ViewportToTile = (x : number, y : number) => [number, number];

export default function fromEmitter(
  emitter : EventEmitter,
  viewportToTile : ViewportToTile,
  dispatch : Dispatch<State>,
  engine : Engine){
  dispatchOn(emitter, dispatch, {
    [TAP]: handleTap(viewportToTile, engine),
    [DOUBLE_TAP]: handleDoubleTap(viewportToTile),
    [SHOW_CONTEXT_MENU]: handleShowContextMenu(viewportToTile),
    [LOAD_CONTEXT_MENU]: handleLoadContextMenu(viewportToTile),
    [ABORT_LOAD_CONTEXT_MENU]: handleAbortContextMenu,
    [MOVE_SELECTION]: handleMoveSelection
  });
}

export function dispatchOn(emitter : EventEmitter, dispatch : Dispatch<State>, eventMap : {
  [event : string] : (event : any) => any
}){
  for(let event in eventMap){
    const map = eventMap[event];
    emitter.on(event, (event : any) => dispatch(map(event)));
  }
}

export function handleTap(viewportToTile : ViewportToTile, engine : Engine){
  return ({x, y} : {x : number, y : number}) =>
    (dispatch : Dispatch<State>, getState : () => State) => {
      const [tx, ty] = viewportToTile(x, y).map(Math.floor);

      if(tx < 0 || ty < 0 || tx > 128 || ty > 128) return;

      const {context, editor : {selectedTool, toolDirection}} = getState();
      if(context == undefined) return;
      const forest = context.forest;
      window.requestAnimationFrame(() => {
        const area = getTileAt(forest.enneaTree, ty, tx);
        if(area && area.data && area.data.type === BUTTON){
          const net = area.data.net;
          engine.mutateContext(mutator => mutator.toggleGate(net));
        }else{
          dispatch(tapTile(tx, ty, selectedTool, toolDirection));
          if(selectedTool == BUTTON
          || selectedTool == GATE
          || selectedTool == LIGHT){
            const context = getState().context;
            if(context == undefined) return;

            const mutatedForest = context.forest;
            if(forest === mutatedForest){
              dispatch(insertMovableItem(selectedTool, toolDirection, tx, ty));
            }else{
              dispatch(save(`Inserted ${selectedTool}`));
            }
          }else{
            dispatch(save(`Inserted ${selectedTool}`));
          }
        }
      });
  };
}

export function handleDoubleTap(viewportToTile : ViewportToTile){
  return ({x, y} : {x : number, y : number}) =>
    async (dispatch : Dispatch<State>, getState : () => State) => {
      const [tx, ty] = viewportToTile(x, y);
      if(tx < 0 || ty < 0 || tx > 128 || ty > 128){
        const context = getState().context;
        if(context == undefined) return;

        const previousContext = context.previous;
        if(previousContext){
          const component = packageComponent(context.forest, context.name);
          dispatch(popContext());
          const {forest, didntFit} = replaceComponents(previousContext.forest, component);
          if(previousContext.forest !== forest){
            dispatch(setForest(forest));
          }
          if(didntFit.length > 0){
            dispatch(insertComponentPackages(component, getIterableIterator(didntFit)));
          }else if(previousContext.forest !== forest){
            dispatch(save(`Updated ${component.name}`));
          }
        }
      }else{
        const state = getState();
        if(state.context == undefined) return;

        const areaData = getTileAt(state.context.forest.enneaTree, ty|0, tx|0);
        if(areaData && areaData.data.type === 'component' && areaData.data.name){
          const name = areaData.data.name;
          const centerX = areaData.left + areaData.width/2;
          const centerY = areaData.top + areaData.height/2;
          const posA = viewportToTile(0, 0);
          const posB = viewportToTile(state.view.pixelWidth, state.view.pixelHeight);
          const forest = await storage.load(name);
          dispatch(pushContext(name, forest, box(posA, posB), centerX, centerY));
        }
      }
  };
}

export function handleShowContextMenu(viewportToTile : ViewportToTile){
  return ({x, y} : {x : number, y : number}) =>
    (dispatch : Dispatch<State>, getState : () => State) => {
      const [tx, ty] = viewportToTile(x, y);
      if(tx < 0 || ty < 0 || tx > 128 || ty > 128){
        dispatch(abortLoadContextMenu());
      }else{
        const context = getState().context;
        if(context == undefined) return;

        const enneaTree = context.forest.enneaTree;
        const tile = getTypeAt(enneaTree, Math.floor(tx), Math.floor(ty));
        dispatch(showContextMenu(
          tile,
          tx,
          ty));
      }
    };
}

export function handleLoadContextMenu(viewportToTile : ViewportToTile){
  return ({x, y} : {x : number, y : number}) => {
    const [tx, ty] = viewportToTile(x, y);
    if(tx < 0 || ty < 0 || tx > 128 || ty > 128){
      return abortLoadContextMenu();
    }else{
      return loadContextMenu(x, y);
    }
  };
}

export function handleAbortContextMenu({x, y} : {x : number, y : number}){
  return abortLoadContextMenu();
}

export function handleMoveSelection({dx, dy} : {dx : number, dy : number}){
  return (dispatch : Dispatch<State>, getState : () => State) => {
    dispatch(moveSelection(dx, dy));
    const state = getState();
    if(state.context == undefined) return;

    const selection = state.selection;
    if(!selection.selection) return;
    const isValid = isEmpty(
      state.context.forest.enneaTree,
      selection.top + selection.dy,
      selection.left + selection.dx,
      selection.right + selection.dx,
      selection.bottom + selection.dy);
    dispatch(setOkCancelMenuValid(isValid));
  };
}

function replaceComponents(forest : Forest, newComponent : CompiledComponent){
  const didntFit = [] as {x : number, y : number}[];
  for(const item of getComponents(forest, newComponent.name)){
    const x = item.left + (item.width>>1);
    const y = item.top + (item.height>>1);
    const clearedForest = clear(forest, x, y);
    const newForest = drawComponent(clearedForest, x, y, newComponent);
    if(newForest === clearedForest){
      didntFit.push({x, y});
    }else{
      forest = newForest;
    }
  }
  return {forest, didntFit};
}

function *getComponents(forest : Forest, name : string) : IterableIterator<AreaData<Component>>{
  const size = forest.enneaTree.size;
  for(const item of getIterator(forest.enneaTree, box([0,0], [size, size]))){
    if(item.data.type === COMPONENT
    && item.data.name === name){
      yield {
        ...item,
        data: item.data
      };
    }
  }
}

function box([left, top] : number[], [right, bottom] : number[]){
  return {top, left, right, bottom};
}

function *getIterableIterator<T>(list : T[]) : IterableIterator<T>{
  for(const item of list){
    yield item;
  };
}