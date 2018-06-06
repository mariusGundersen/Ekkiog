import {
  Direction,
  TreeNode,
  createForest,
  Item,
  LIGHT,
  GATE,
  LEFTWARDS,
  RIGHTWARDS,
  DOWNWARDS,
  UPWARDS,
  Light,
  Gate,
  COMPONENT,
  Component,
  Area
} from 'ekkiog-editing';
import getNetAt from 'ekkiog-editing/es/query/getNetAt';
import { getLightNeighbouringNet } from 'ekkiog-editing/es/query/getNeighbouringNets';
import { get as getTileAt } from 'ennea-tree';
import { put, select, take } from 'redux-saga/effects';

import {
  insertItem,
  MoveItemAtAction,
  removeTileAt,
  resetEditorMenu,
  saveForest,
  selectItem,
  setForest,
  showOkCancelMenu,
  stopSelection,
} from '../actions';
import copyTo from '../editing/copyTo';
import { State } from '../reduce';

export default function* moveItemAt({tx, ty} : MoveItemAtAction){
  const state : State = yield select();

  const item = getTileAt(state.context.forest.enneaTree, ty, tx);
  yield put(removeTileAt(tx, ty));
  yield put(selectItem(copyTo(createForest(), item.data, item), item));

  yield put(showOkCancelMenu(true));
  const {ok} = yield take('okCancel');
  if(ok) {
    const {selection, context} : State = yield select();
    if(selection.selection == false) return;
    const box = {
      left: selection.x + selection.dx,
      top: selection.y + selection.dy,
      width: item.width,
      height: item.height
    };
    yield put(insertItem(setInputs(item.data, context.forest.enneaTree, box), box, state.context.forest.buddyTree));
    yield put(saveForest(`Moved ${item.data.type}`));
    yield put(stopSelection());
    yield put(resetEditorMenu());
  } else {
    yield put(setForest(state.context.forest));
    yield put(stopSelection());
    yield put(resetEditorMenu());
  }
};

function setInputs(item: Item, enneaTree: TreeNode, box : Area): Item {
  switch(item.type){
    case LIGHT:
      return {
        ...item,
        net: getLightNeighbouringNet(
          enneaTree,
          box.left + 1,
          box.top + 1,
          directionToDx(item.direction),
          directionToDy(item.direction))
      } as Light;
    case GATE:
      return {
        ...item,
        inputA: getNetAt(enneaTree, box.left - 1, box.top,     -1, 0),
        inputB: getNetAt(enneaTree, box.left - 1, box.top + 2, -1, 0)
      } as Gate;
    case COMPONENT:
      const inputs = item.inputs.map(input => ({
        ...input,
        net: getNetAtPos(enneaTree, box.left, box.top, input.x, input.y, getDirection(input.x, box.width), getDirection(input.y, box.height)),
      }));
      const gates = [...item.gates];
      for(const input of inputs){
        for(const point of input.pointsTo){
          gates.splice(point.index, 1, {
            ...gates[point.index],
            ...(point.input === "A" ? {
              inputA: input.net
            } : {
              inputB: input.net
            })
          });
        }
      }
      return {
        ...item,
        inputs,
        gates
      } as Component;
    default:
      return item;
  }
}

function getNetAtPos(tree : TreeNode, sx : number, sy : number, x : number, y : number, dx : number, dy : number){
  return getNetAt(tree, sx+x+dx, sy+y+dy, dx, dy);
}

function directionToDx(direction : Direction){
  switch(direction){
    case LEFTWARDS:
      return -1;
    case RIGHTWARDS:
      return 1;
    case DOWNWARDS:
    case UPWARDS:
    default:
      return 0;
  }
}

function directionToDy(direction : Direction){
  switch(direction){
    case DOWNWARDS:
      return 1;
    case UPWARDS:
      return -1;
    case LEFTWARDS:
    case RIGHTWARDS:
    default:
      return 0;
  }
}

function getDirection(pos : number, max : number){
  if(pos === 0) return -1;
  if(pos === max) return 1;
  return 0;
}