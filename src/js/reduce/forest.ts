import {
  Forest,
  Direction,
  Tool,
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
  LIGHT,
  createForest,

  getTypeAt,

  drawWire,
  drawGate,
  drawUnderpass,
  drawButton,
  drawLight,
  clear,
  floodClear,
  getTileAt
} from '../editing';

import {
  Action
} from '../actions';
import { update } from 'ennea-tree';

export { Forest };

export default function editing(forest = createForest(), action: Action): Forest {
  switch (action.type) {
    case 'set-forest':
      return action.forest || forest;
    case 'draw':
      return tap(forest, action.tool, action.direction, action.x, action.y);
    case 'remove-tile-at':
      return clear(forest, action.x, action.y);
    case 'flood-clear-at':
      return floodClear(forest, action.x, action.y);
    case 'convert-wire-to-underpass':
      return wireToUnderpass(forest, action.x, action.y);
    case 'convert-underpass-to-wire':
      return underpassToWire(forest, action.x, action.y);
    case 'rotate-tile-at':
      return rotate(forest, action.x, action.y, action.direction);
    case 'make-permanent':
      return makePermanent(forest, action);
    case 'set-test-scenario':
      return makePermanent(forest, ...action.testScenario.probes);
    default:
      return forest;
  }
}

function rotate(forest: Forest, x: number, y: number, direction: Direction) {
  const item = getTileAt(forest, x, y);
  if (item.data.type === BUTTON || item.data.type === LIGHT) {
    forest = clear(forest, x, y);
    return tap(forest, item.data.type, direction, item.left + 1, item.top + 1);
  }

  return forest;
}

export function tap(forest: Forest, tool: Tool, direction: Direction, x: number, y: number): Forest {
  if (tool === WIRE) {
    const type = getTypeAt(forest.enneaTree, x, y);
    if (type === WIRE || type === UNDERPASS) {
      return clear(forest, x, y);
    } else {
      return drawWire(forest, x, y);
    }
  } else if (tool === UNDERPASS) {
    const type = getTypeAt(forest.enneaTree, x, y);
    if (type === UNDERPASS || type === WIRE) {
      return clear(forest, x, y);
    } else {
      return drawUnderpassWithWires(forest, x, y);
    }
  } else if (tool === GATE) {
    return drawGate(forest, x + 2, y);
  } else if (tool === BUTTON) {
    return drawButton(forest, x, y, direction);
  } else if (tool === LIGHT) {
    return drawLight(forest, x, y, direction);
  } else {
    return forest;
  }
}

function drawUnderpassWithWires(forest: Forest, x: number, y: number) {
  const forest1 = drawUnderpass(forest, x, y);
  if (forest === forest1) {
    return forest;
  }
  const forest2 = drawWire(forest1, x, y - 1);
  const forest3 = drawWire(forest2, x, y + 1);
  const forest4 = drawWire(forest3, x - 1, y);
  const forest5 = drawWire(forest4, x + 1, y);
  return forest5;
}

function wireToUnderpass(forest: Forest, x: number, y: number) {
  const type = getTypeAt(forest.enneaTree, x, y);
  if (type !== WIRE) return forest;

  const tempForest = clear(forest, x, y);
  const result = drawUnderpassWithWires(tempForest, x, y);
  if (result === tempForest) return forest;

  return result;
}

function underpassToWire(forest: Forest, x: number, y: number) {
  const type = getTypeAt(forest.enneaTree, x, y);
  if (type !== UNDERPASS) return forest;

  const tempForest = clear(forest, x, y);
  const result = drawWire(tempForest, x, y);
  if (result === tempForest) return forest;

  return result;
}

function makePermanent(forest: Forest, ...positions: { x: number, y: number }[]) {
  const updater = update(forest.enneaTree, item => {
    switch (item.type) {
      case 'button':
      case 'light':
        return {
          ...item,
          permanent: true
        };
      default:
        return item;
    }
  });
  for (const { x, y } of positions) {
    updater.update({ top: y, left: x }, {});
  }

  const enneaTree = updater.result();

  if (enneaTree == forest.enneaTree)
    return forest;

  return {
    ...forest,
    enneaTree
  };
}