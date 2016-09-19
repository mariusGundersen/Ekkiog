import test from 'ava';

import * as quadtree from './quadtree.js';

test('get of null', t => {
  const result = quadtree.get(null, 0, 0);
  t.is(result, null);
});

test('set on empty', t => {
  const data = {};
  const result = quadtree.set(null, 0, 0, data);
  t.is(result.size, 1);
  t.is(result.data, data);
  t.falsy(result.ne);
  t.falsy(result.nw);
  t.falsy(result.se);
  t.falsy(result.sw);
});

test('set on exact', t => {
  const data = {};
  const initial = quadtree.createNode(1);
  const result = quadtree.set(initial, 0, 0, data);
  t.not(initial, result);
  t.is(result.size, 1);
  t.is(result.data, data);
  t.falsy(result.ne);
  t.falsy(result.nw);
  t.falsy(result.se);
  t.falsy(result.sw);
});

test('set on ne', t => {
  const data = {};
  const initial = quadtree.createNode(2);
  const result = quadtree.set(initial, 0, 0, data);
  t.not(initial, result);
  t.is(result.size, 2);
  t.falsy(result.data);
  t.truthy(result.ne);
  t.falsy(result.nw);
  t.falsy(result.se);
  t.falsy(result.sw);
  t.is(result.ne.size, 1);
  t.is(result.ne.data, data);
});

test('set on nw', t => {
  const data = {};
  const initial = quadtree.createNode(2);
  const result = quadtree.set(initial, 1, 0, data);
  t.not(initial, result);
  t.is(result.size, 2);
  t.falsy(result.data);
  t.falsy(result.ne);
  t.truthy(result.nw);
  t.falsy(result.se);
  t.falsy(result.sw);
  t.is(result.nw.size, 1);
  t.is(result.nw.data, data);
});

test('set on se', t => {
  const data = {};
  const initial = quadtree.createNode(2);
  const result = quadtree.set(initial, 0, 1, data);
  t.not(initial, result);
  t.is(result.size, 2);
  t.falsy(result.data);
  t.falsy(result.ne);
  t.falsy(result.nw);
  t.truthy(result.se);
  t.falsy(result.sw);
  t.is(result.se.size, 1);
  t.is(result.se.data, data);
});

test('set on sw', t => {
  const data = {};
  const initial = quadtree.createNode(2);
  const result = quadtree.set(initial, 1, 1, data);
  t.not(initial, result);
  t.is(result.size, 2);
  t.falsy(result.data);
  t.falsy(result.ne);
  t.falsy(result.nw);
  t.falsy(result.se);
  t.truthy(result.sw);
  t.is(result.sw.size, 1);
  t.is(result.sw.data, data);
});

test('set replace data', t => {
  const initial = quadtree.createNode(2);
  const result1 = quadtree.set(initial, 1, 1, {});
  const result2 = quadtree.set(result1, 1, 1, {});
  t.not(initial, result1);
  t.not(result1, result2);
});

test('set null', t => {
  const initial = quadtree.createNode(2);
  const result1 = quadtree.set(initial, 0, 0, {});
  const result2 = quadtree.set(result1, 1, 1, null);
  t.not(initial, result1);
  t.not(result1, result2);
  t.falsy(result2.sw);
});

test('clear', t => {
  const initial = quadtree.createNode(2);
  const result1 = quadtree.set(initial, 0, 0, {});
  const result2 = quadtree.clear(result1, 1, 1);
  t.not(initial, result1);
  t.not(result1, result2);
  t.falsy(result2.sw);
});

test('clear existing data', t => {
  const initial = quadtree.createNode(2);
  const result1 = quadtree.set(initial, 0, 0, {});
  const result2 = quadtree.set(result1, 1, 1, {});
  const result3 = quadtree.set(result2, 1, 1, null);
  t.not(initial, result1);
  t.not(result1, result2);
  t.not(result2, result3);
  t.falsy(result3.sw);
});

test('all branches are null', t => {
  const initial = quadtree.createNode(16);
  const result = quadtree.set(initial, 1, 1, null);
  t.is(result, null);
});

test('get data exact match', t => {
  const data = {}
  const initial = quadtree.createNode(1);
  const result1 = quadtree.set(initial, 0, 0, data);
  const result = quadtree.get(result1, 0, 0);
  t.is(result, data);
});

test('get data ne', t => {
  const data = {}
  const initial = quadtree.createNode(2);
  const result1 = quadtree.set(initial, 0, 0, data);
  const result = quadtree.get(result1, 0, 0);
  t.is(result, data);
});

test('get data nw', t => {
  const data = {}
  const initial = quadtree.createNode(2);
  const result1 = quadtree.set(initial, 1, 0, data);
  const result = quadtree.get(result1, 1, 0);
  t.is(result, data);
});

test('get data se', t => {
  const data = {}
  const initial = quadtree.createNode(2);
  const result1 = quadtree.set(initial, 0, 1, data);
  const result = quadtree.get(result1, 0, 1);
  t.is(result, data);
});

test('get data sw', t => {
  const data = {}
  const initial = quadtree.createNode(2);
  const result1 = quadtree.set(initial, 1, 1, data);
  const result = quadtree.get(result1, 1, 1);
  t.is(result, data);
});