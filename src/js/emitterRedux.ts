import { EventEmitter } from 'events';
import { get, getIterator } from 'ennea-tree';
import { getTypeAt, isEmpty, Forest, BUTTON, COMPONENT, clear, packageComponent, drawComponent, CompiledComponent } from 'ekkiog-editing';

import {Dispatch, Store} from 'react-redux';

import {
  Action,
  tapTile,
  loadContextMenu,
  abortLoadContextMenu,
  showContextMenu,
  setOkCancelMenuValid,
  moveSelection,
  setForest,
  loadForest,
  pushEditor,
  popEditor
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

import storage from './storage';
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
      const [tx, ty] = viewportToTile(x, y);

      if(tx < 0 || ty < 0 || tx > 128 || ty > 128) return;

      const {forest, editor : {selectedTool, toolDirection}} = getState();
      window.requestAnimationFrame(() => {
        const area = get(forest.enneaTree, ty, tx);
        if(area && area.data && area.data.type === BUTTON){
          const net = area.data.net;
          engine.mutateContext(mutator => mutator.toggleGate(net));
        }else{
          dispatch(tapTile(Math.floor(tx), Math.floor(ty), selectedTool, toolDirection));
        }
      });
  };
}

export function handleDoubleTap(viewportToTile : ViewportToTile){
  return ({x, y} : {x : number, y : number}) =>
    async (dispatch : Dispatch<State>, getState : () => State) => {
      const [tx, ty] = viewportToTile(x, y);
      if(tx < 0 || ty < 0 || tx > 128 || ty > 128){
        const {editor, forest} = getState();
        const topOfStack = editor.history;
        if(topOfStack){
          const editedComponentName = editor.currentComponentName;
          const {name, boundingBox} = topOfStack.value;
          let parentComponent : Forest = await storage.load(name);
          dispatch(popEditor());
          parentComponent = replaceComponents(parentComponent, packageComponent(forest, editedComponentName));
          dispatch(setForest(name, parentComponent, boundingBox));
        }
      }else{
        const state = getState();
        const forest = state.forest;
        const areaData = get(forest.enneaTree, ty|0, tx|0);
        if(areaData && areaData.data.type === 'component' && areaData.data.name){
          const name = areaData.data.name;
          const centerX = areaData.left + areaData.width/2;
          const centerY = areaData.top + areaData.height/2;
          const posA = viewportToTile(0, 0);
          const posB = viewportToTile(state.view.pixelWidth, state.view.pixelHeight);
          dispatch(pushEditor(state.editor.currentComponentName, box(posA, posB), centerX, centerY));
          dispatch(loadForest(name, false));
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
        const enneaTree = getState().forest.enneaTree;
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
    const selection = state.selection;
    if(!selection.selection) return;
    const isValid = isEmpty(
      state.forest.enneaTree,
      selection.top + selection.dy,
      selection.left + selection.dx,
      selection.right + selection.dx,
      selection.bottom + selection.dy);
    dispatch(setOkCancelMenuValid(isValid));
  };
}

function replaceComponents(parentComponent : Forest, newComponent : CompiledComponent){
  for(const item of getIterator(parentComponent.enneaTree, box([0,0], [parentComponent.enneaTree.size, parentComponent.enneaTree.size]))){
    if(item.data.type === COMPONENT){
      const x = item.left + (item.width>>1);
      const y = item.top + (item.height>>1);
      parentComponent = clear(parentComponent, x, y);
      parentComponent = drawComponent(parentComponent, x, y, newComponent);
    }
  }
  return parentComponent;
}

function box([left, top] : number[], [right, bottom] : number[]){
  return {top, left, right, bottom};
}