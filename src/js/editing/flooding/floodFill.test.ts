import test from 'ava';
import createForest from '../actions/createForest';
import drawComponent from '../actions/drawComponent';
import { straightThroughPackage } from '../packing/index.test';
import drawLight from '../actions/drawLight';
import drawButton from '../actions/drawButton';
import getTileAt from '../query/getTileAt';
import { Light } from '../types';
import clear from '../actions/clear';
import { LEFTWARDS } from '../constants';

test('floodFill straight through, component first', t => {
  let forest = createForest();
  forest = drawComponent(forest, 64, 64, straightThroughPackage);
  forest = drawLight(forest, 67, 64);
  forest = drawButton(forest, 61, 64);
  const result = getTileAt(forest, 67, 64).data as Light;
  t.is(result.net, 2);
});

test('floodFill straight through, component last', t => {
  let forest = createForest();
  forest = drawLight(forest, 67, 64);
  forest = drawButton(forest, 61, 64);
  forest = drawComponent(forest, 64, 64, straightThroughPackage);
  const result = getTileAt(forest, 67, 64).data as Light;
  t.is(result.net, 2);
});

test('floodFill straight through reverse, component last', t => {
  let forest = createForest();
  forest = drawButton(forest, 67, 64, LEFTWARDS);
  forest = drawLight(forest, 61, 64, LEFTWARDS);
  forest = drawComponent(forest, 64, 64, straightThroughPackage);
  const result = getTileAt(forest, 61, 64).data as Light;
  t.is(result.net, 2);
});

test('floodClear straight through component', t => {
  let forest = createForest();
  forest = drawComponent(forest, 64, 64, straightThroughPackage);
  forest = drawLight(forest, 67, 64);
  forest = drawButton(forest, 61, 64);
  forest = clear(forest, 64, 64);
  const result = getTileAt(forest, 67, 64).data as Light;
  t.is(result.net, 0);
});