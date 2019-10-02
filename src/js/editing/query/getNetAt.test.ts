import test from 'ava';

import getNetAt from './getNetAt';
import createForest from '../actions/createForest';
import drawWire from '../actions/drawWire';
import drawButton from '../actions/drawButton';
import drawGate from '../actions/drawGate';
import drawComponent from '../actions/drawComponent';
import { Package } from '../types';
import { andPackage, straightThroughPackage } from '../packing/index.test';

test('wire - ground', t => {
  let forest = createForest();
  forest = drawWire(forest, 64, 64);
  const net = getNetAt(forest.enneaTree, 64, 64, 0, 0);
  t.is(net, 0);
});

test('wire - not ground', t => {
  let forest = createForest();
  forest = drawButton(forest, 62, 64);
  forest = drawWire(forest, 64, 64);
  const net = getNetAt(forest.enneaTree, 64, 64, 0, 0);
  t.is(net, 2);
});

test('button - output', t => {
  let forest = createForest();
  forest = drawButton(forest, 63, 64);
  const net = getNetAt(forest.enneaTree, 64, 64, -1, 0);
  t.is(net, 2);
});

test('button - ground', t => {
  let forest = createForest();
  forest = drawButton(forest, 63, 64);
  const net = getNetAt(forest.enneaTree, 62, 64, 1, 0);
  t.is(net, 0);
});

test('gate - output', t => {
  let forest = createForest();
  forest = drawGate(forest, 64, 64);
  const net = getNetAt(forest.enneaTree, 64, 64, -1, 0);
  t.is(net, 2);
});

test('gate - ground', t => {
  let forest = createForest();
  forest = drawGate(forest, 64, 64);
  const net = getNetAt(forest.enneaTree, 62, 64, 1, 0);
  t.is(net, 0);
});

test('component - corner', t => {
  let forest = createForest();
  forest = drawComponent(forest, 64, 64, andPackage);
  const net = getNetAt(forest.enneaTree, 63, 62, 1, 0);
  t.is(net, 0);
});

test('component - left edge', t => {
  let forest = createForest();
  forest = drawComponent(forest, 64, 64, andPackage);
  const net = getNetAt(forest.enneaTree, 63, 64, 1, 0);
  t.is(net, 0);
});

test('component - top edge', t => {
  let forest = createForest();
  forest = drawComponent(forest, 64, 64, andPackage);
  const net = getNetAt(forest.enneaTree, 64, 62, 0, 1);
  t.is(net, 0);
});

test('component - input', t => {
  let forest = createForest();
  forest = drawComponent(forest, 64, 64, andPackage);
  const net = getNetAt(forest.enneaTree, 63, 63, 1, 0);
  t.is(net, 0);
});

test('component - output', t => {
  let forest = createForest();
  forest = drawComponent(forest, 64, 64, andPackage);
  const net = getNetAt(forest.enneaTree, 65, 64, -1, 0);
  t.is(net, 3);
});

test('component - through first', t => {
  let forest = createForest();
  forest = drawButton(forest, 61, 64);
  forest = drawComponent(forest, 64, 64, straightThroughPackage);
  const net = getNetAt(forest.enneaTree, 65, 64, -1, 0);
  t.is(net, 2);
});

test('component - through second', t => {
  let forest = createForest();
  forest = drawButton(forest, 67, 64, "leftwards");
  forest = drawComponent(forest, 64, 64, straightThroughPackage);
  const net = getNetAt(forest.enneaTree, 63, 64, 1, 0);
  t.is(net, 2);
});
