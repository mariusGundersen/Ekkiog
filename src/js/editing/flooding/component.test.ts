import test from 'ava';
import { get, BoxContext } from 'ennea-tree';
import component from './component';
import createForest from '../actions/createForest';
import drawComponent from '../actions/drawComponent';
import { andPackage, straightThroughPackage } from '../packing/index.test';
import { Component } from '../types';
import { Context } from './types';

test('into input', t => {
  let forest = createForest();
  forest = drawComponent(forest, 64, 64, andPackage);
  const queue = [] as BoxContext<Context>[];
  const result = component(get(forest.enneaTree, 64, 64).data as Component, { left: 0, top: 1 }, { net: 5, pos: { top: 64, left: 66 }, prev: { top: 64, left: 63 } }, queue);
  t.deepEqual(result.inputs, [
    {
      net: 5,
      input: 0,
      name: ''
    },
    {
      net: 0,
      input: -1,
      name: ''
    }
  ]);
  t.deepEqual(queue, []);
});

test('into input straightThrough', t => {
  let forest = createForest();
  forest = drawComponent(forest, 64, 64, straightThroughPackage);
  const queue = [] as BoxContext<Context>[];
  const result = component(get(forest.enneaTree, 64, 64).data as Component, { left: 0, top: 1 }, { net: 5, pos: { top: 64, left: 63 }, prev: { top: 64, left: 62 } }, queue);
  t.deepEqual(result.inputs, [
    {
      net: 5,
      input: 0,
      name: ''
    }
  ]);
  t.deepEqual(queue, [{
    area: {
      top: 64,
      left: 66,
      right: 67,
      bottom: 65
    },
    context: {
      net: 5,
      pos: {
        top: 64,
        left: 66
      },
      prev: {
        top: 64,
        left: 65
      }
    }
  }]);
});