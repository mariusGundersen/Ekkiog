import test from 'ava';

import * as memory from './memory.js';
import reconcileMemory from './reconcileMemory.js';

test('when both new and old is null', t => {
  const result = reconcileMemory(null, null);
  t.deepEqual(result, []);
});

test('when nothing has changed', t => {
  const data = {};
  const result = reconcileMemory(data, data);
  t.deepEqual(result, []);
});

test('when new has data', t => {
  const data = {};
  const [memoryTree, address] = memory.addData(null, data, 1);
  const result = reconcileMemory(null, memoryTree);
  t.deepEqual(result, [{type:'add', data, address}]);
});

test('when new has deeply nested data', t => {
  const data = {};
  const memoryTree1 = memory.createFromSize(16);
  const [memoryTree, address] = memory.addData(memoryTree1, data, 1);
  const result = reconcileMemory(null, memoryTree);
  t.deepEqual(result, [{type:'add', data, address}]);
});

test('when new has data in both branches', t => {
  const data1 = {};
  const data2 = {};
  const memoryTree = memory.createFromSize(2);
  const [memoryTree1, address1] = memory.addData(memoryTree, data1, 1);
  const [memoryTree2, address2] = memory.addData(memoryTree1, data2, 1);
  const result = reconcileMemory(null, memoryTree2);
  t.deepEqual(result, [
    {type:'add', data:data1, address:address1},
    {type:'add', data:data2, address:address2}
  ]);
});

test('when old has data', t => {
  const data = {};
  const [memoryTree, address] = memory.addData(null, data, 1);
  const result = reconcileMemory(memoryTree, null);
  t.deepEqual(result, [{type:'remove', data, address}]);
});


test('when old has deeply nested data', t => {
  const data = {};
  const memoryTree1 = memory.createFromSize(16);
  const [memoryTree, address] = memory.addData(memoryTree1, data, 1);
  const result = reconcileMemory(memoryTree, null);
  t.deepEqual(result, [{type:'remove', data, address}]);
});

test('when old has data in both branches', t => {
  const data1 = {};
  const data2 = {};
  const memoryTree = memory.createFromSize(2);
  const [memoryTree1, address1] = memory.addData(memoryTree, data1, 1);
  const [memoryTree2, address2] = memory.addData(memoryTree1, data2, 1);
  const result = reconcileMemory(memoryTree2, null);
  t.deepEqual(result, [
    {type:'remove', data:data1, address:address1},
    {type:'remove', data:data2, address:address2}
  ]);
});

test('when old has data in the left branch and new has data in both branches', t => {
  const data1 = {};
  const data2 = {};
  const memoryTree = memory.createFromSize(2);
  const [memoryTree1, address1] = memory.addData(memoryTree, data1, 1);
  const [memoryTree2, address2] = memory.addData(memoryTree1, data2, 1);
  const result = reconcileMemory(memoryTree1, memoryTree2);
  t.deepEqual(result, [
    {type:'add', data:data2, address:address2}
  ]);
});

test('when old has data in both branch and new has data in the left', t => {
  const data1 = {};
  const data2 = {};
  const memoryTree = memory.createFromSize(2);
  const [memoryTree1, address1] = memory.addData(memoryTree, data1, 1);
  const [memoryTree2, address2] = memory.addData(memoryTree1, data2, 1);
  const result = reconcileMemory(memoryTree2, memoryTree1);
  t.deepEqual(result, [
    {type:'remove', data:data2, address:address2}
  ]);
});

test('when old has data in the right branch and new has data in both branches', t => {
  const data1 = {};
  const data2 = {};
  const memoryTree = memory.createFromSize(2);
  const [memoryTree1, address1] = memory.addData(memoryTree, data1, 1);
  const [memoryTree2, address2] = memory.addData(memoryTree1, data2, 1);
  const memoryTree3 = memory.clearData(memoryTree2, address1);
  const result = reconcileMemory(memoryTree3, memoryTree2);
  t.deepEqual(result, [
    {type:'add', data:data1, address:address1}
  ]);
});

test('when old has data in both branch and new has data in the right', t => {
  const data1 = {};
  const data2 = {};
  const memoryTree = memory.createFromSize(2);
  const [memoryTree1, address1] = memory.addData(memoryTree, data1, 1);
  const [memoryTree2, address2] = memory.addData(memoryTree1, data2, 1);
  const memoryTree3 = memory.clearData(memoryTree2, address1);
  const result = reconcileMemory(memoryTree2, memoryTree3);
  t.deepEqual(result, [
    {type:'remove', data:data1, address:address1}
  ]);
});

test('when data has changed between new and old', t => {
  const data1 = {};
  const data2 = {};
  const memoryTree = memory.createFromSize(2);
  const [memoryTree1, address1] = memory.addData(memoryTree, data1, 1);
  const memoryTree2 = memory.setData(memoryTree1, address1, data2);
  const result = reconcileMemory(memoryTree1, memoryTree2);
  t.deepEqual(result, [
    {type:'set', data:data1, address:address1}
  ]);
});