import test from 'ava';
import createForest from '../actions/createForest';
import { EMPTY, DOWNWARDS, WIRE, RIGHTWARDS, LIGHT } from '../constants';
import drawWire from '../actions/drawWire';
import floodClear from './floodClear';
import getTypeAt from '../query/getTypeAt';
import drawUnderpass from '../actions/drawUnderpass';
import drawButton from '../actions/drawButton';
import getTileAt from '../query/getTileAt';
import drawLight from '../actions/drawLight';

test('floodClear single wire', t => {
  let forest = createForest();
  forest = drawWire(forest, 64, 64);
  forest = floodClear(forest, 64, 64);
  const result = getTypeAt(forest.enneaTree, 64, 64);
  t.is(result, EMPTY);
});

test('floodClear cross wire', t => {
  let forest = createForest();
  forest = drawWire(forest, 64, 64);
  forest = drawWire(forest, 64, 65);
  forest = drawWire(forest, 65, 64);
  forest = drawWire(forest, 64, 63);
  forest = drawWire(forest, 63, 64);
  forest = floodClear(forest, 64, 64);
  const result = forest.enneaTree;
  t.falsy(result.bottomLeft);
  t.falsy(result.bottomRight);
  t.falsy(result.topLeft);
  t.falsy(result.topRight);
});

test('floodClear long vertical wire', t => {
  let forest = createForest();
  forest = drawWire(forest, 64, 64);
  forest = drawWire(forest, 64, 65);
  forest = drawWire(forest, 64, 66);
  forest = drawWire(forest, 64, 67);
  forest = drawWire(forest, 64, 68);
  forest = floodClear(forest, 64, 64);
  const result = forest.enneaTree;
  t.falsy(result.bottomLeft);
  t.falsy(result.bottomRight);
  t.falsy(result.topLeft);
  t.falsy(result.topRight);
});

test('floodClear long horizonal wire', t => {
  let forest = createForest();
  forest = drawWire(forest, 64, 64);
  forest = drawWire(forest, 65, 64);
  forest = drawWire(forest, 66, 64);
  forest = drawWire(forest, 67, 64);
  forest = drawWire(forest, 68, 64);
  forest = floodClear(forest, 64, 64);
  const result = forest.enneaTree;
  t.falsy(result.bottomLeft);
  t.falsy(result.bottomRight);
  t.falsy(result.topLeft);
  t.falsy(result.topRight);
});

test('floodClear vertical underpass', t => {
  let forest = createForest();
  forest = drawWire(forest, 64, 64);
  forest = drawWire(forest, 64, 65);
  forest = drawUnderpass(forest, 64, 66);
  forest = drawWire(forest, 64, 67);
  forest = drawWire(forest, 64, 68);
  forest = floodClear(forest, 64, 64);
  const result = forest.enneaTree;
  t.falsy(result.bottomLeft);
  t.falsy(result.bottomRight);
  t.falsy(result.topLeft);
  t.falsy(result.topRight);
});

test('floodClear horizontal underpass', t => {
  let forest = createForest();
  forest = drawWire(forest, 64, 64);
  forest = drawWire(forest, 65, 64);
  forest = drawUnderpass(forest, 66, 64);
  forest = drawWire(forest, 67, 64);
  forest = drawWire(forest, 68, 64);
  forest = floodClear(forest, 64, 64);
  const result = forest.enneaTree;
  t.falsy(result.bottomLeft);
  t.falsy(result.bottomRight);
  t.falsy(result.topLeft);
  t.falsy(result.topRight);
});

test('floodClear vertical underpass with crossing wire', t => {
  let forest = createForest();
  forest = drawWire(forest, 64, 64);
  forest = drawWire(forest, 64, 65);
  forest = drawUnderpass(forest, 64, 66);
  forest = drawWire(forest, 64, 67);
  forest = drawWire(forest, 64, 68);

  forest = drawButton(forest, 61, 66, RIGHTWARDS);
  forest = drawWire(forest, 63, 66);
  forest = drawWire(forest, 65, 66);

  forest = floodClear(forest, 64, 64);
  const result = getTileAt(forest, 64, 66);
  t.is(result.data.type, WIRE);
  t.is(result.data.net, 2);
});

test('floodClear horizontal underpass with crossing wire', t => {
  let forest = createForest();
  forest = drawWire(forest, 64, 64);
  forest = drawWire(forest, 65, 64);
  forest = drawUnderpass(forest, 66, 64);
  forest = drawWire(forest, 67, 64);
  forest = drawWire(forest, 68, 64);

  forest = drawButton(forest, 66, 61, DOWNWARDS);
  forest = drawWire(forest, 66, 63);
  forest = drawWire(forest, 66, 65);

  forest = floodClear(forest, 64, 64);
  const result = getTileAt(forest, 66, 64);
  t.is(result.data.type, WIRE);
  t.is(result.data.net, 2);
});

test('floodClear into light', t => {
  let forest = createForest();

  forest = drawButton(forest, 62, 64);
  forest = drawWire(forest, 64, 64);
  forest = drawWire(forest, 65, 64);
  forest = drawLight(forest, 67, 64);

  forest = floodClear(forest, 64, 64);
  const result = getTileAt(forest, 66, 64);
  t.is(result.data.type, LIGHT);
  t.is(result.data.net, 0);
})
