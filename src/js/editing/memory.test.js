import test from 'ava';
import * as memory from './memory.js';

test('when requesting data from null', t => {
  const [result, address] = memory.addData(null, {}, 16);
  t.is(address, 0);
  t.is(result.size, 16);
  t.deepEqual(result.data, {});
});

test('when requesting the full memory', t => {
  const memoryTree = createMemoryTree();
  const [result, address] = memory.addData(memoryTree, {}, memoryTree.size);
  t.not(memoryTree, result);
  t.is(address, 0);
  t.deepEqual(result.data, {});
});

test('when requesting the full memory twice', t => {
  const memoryTree = createMemoryTree();
  const [result1, address1] = memory.addData(memoryTree, {}, memoryTree.size);
  const [result2, address2] = memory.addData(result1, {}, memoryTree.size);
  t.not(memoryTree, result1);
  t.is(address1, 0);
  t.is(address2, -1);
  t.is(result1, result2);
});

test('when requesting half the memory', t => {
  const memoryTree = createMemoryTree();
  const [result, address] = memory.addData(memoryTree, {}, memoryTree.size/2);
  t.not(memoryTree, result);
  t.is(address, 0);
  t.falsy(result.data);
  t.truthy(result.left);
  t.falsy(result.right);
  t.truthy(result.left.data);
});

test('when requesting half the memory twice', t => {
  const memoryTree = createMemoryTree();
  const [result1, address1] = memory.addData(memoryTree, {}, memoryTree.size/2);
  const [result2, address2] = memory.addData(result1, {}, memoryTree.size/2);
  t.not(memoryTree, result1);
  t.not(result1, result2);
  t.is(address1, 0);
  t.is(address2, 8);
  t.falsy(result2.data);
  t.truthy(result2.left);
  t.truthy(result2.right);
  t.truthy(result2.left.data);
  t.truthy(result2.right.data);
});

test('when requesting half the memory, then the whole memory', t => {
  const memoryTree = createMemoryTree();
  const [result1, address1] = memory.addData(memoryTree, {}, memoryTree.size/2);
  const [result2, address2] = memory.addData(result1, {}, memoryTree.size);
  t.not(memoryTree, result1);
  t.is(result1, result2);
  t.is(address1, 0);
  t.is(address2, -1);
  t.falsy(result2.data);
  t.truthy(result2.left);
  t.falsy(result2.right);
  t.truthy(result2.left.data);
});

test('when requesting a bit less than half the memory', t => {
  const memoryTree = createMemoryTree();
  const [result, address] = memory.addData(memoryTree, {}, memoryTree.size/2-1);
  t.not(memoryTree, result);
  t.is(address, 0);
  t.falsy(result.data);
  t.truthy(result.left);
  t.falsy(result.right);
  t.truthy(result.left.data);
});

test('when requesting a bit more than a quarter of the memory', t => {
  const memoryTree = createMemoryTree();
  const [result, address] = memory.addData(memoryTree, {}, memoryTree.size/4+1);
  t.not(memoryTree, result);
  t.is(address, 0);
  t.falsy(result.data);
  t.truthy(result.left);
  t.falsy(result.right);
  t.truthy(result.left.data);
});

test('when releasing the full memory', t => {
  const memoryTree = createMemoryTree();
  const [result1, address1] = memory.addData(memoryTree, {}, memoryTree.size);
  const result2 = memory.clearData(result1, address1);
  t.is(result2, null);
});

test('when requesting then releasing half the memory', t => {
  const memoryTree = createMemoryTree();
  const [result1, address1] = memory.addData(memoryTree, {}, memoryTree.size/2);
  const result2 = memory.clearData(result1, address1);
  t.is(result2, null);
});

test('when requesting half the memory twice, then releasing the second half of the memory', t => {
  const memoryTree = createMemoryTree();
  const [result1, address1] = memory.addData(memoryTree, {}, memoryTree.size/2);
  const [result2, address2] = memory.addData(result1, {}, memoryTree.size/2);
  const result3 = memory.clearData(result2, address2);
  t.not(result2, result3);
  t.falsy(result3.data);
  t.truthy(result3.left);
  t.falsy(result3.right);
  t.truthy(result3.left.data);
});

test('when requesting half the memory twice, then releasing both halves of the memory', t => {
  const memoryTree = createMemoryTree();
  const [result1, address1] = memory.addData(memoryTree, {}, memoryTree.size/2);
  const [result2, address2] = memory.addData(result1, {}, memoryTree.size/2);
  const result3 = memory.clearData(result2, address2);
  const result4 = memory.clearData(result3, address1);
  t.is(result4, null);
});

test('when requesting a quarter of the memory twice, then releasing one quarters of the memory', t => {
  const memoryTree = createMemoryTree();
  const [result1, address1] = memory.addData(memoryTree, {}, memoryTree.size/4);
  const [result2, address2] = memory.addData(result1, {}, memoryTree.size/4);
  const result3 = memory.clearData(result2, address2);
  t.not(result2, result3);
  t.falsy(result3.data);
  t.truthy(result3.left);
  t.falsy(result3.right);
  t.falsy(result3.left.data);
  t.truthy(result3.left.left);
  t.falsy(result3.left.right);
  t.truthy(result3.left.left.data);
});

test('when requesting a quarter of the memory twice, then releasing both quarters of the memory', t => {
  const memoryTree = createMemoryTree();
  const [result1, address1] = memory.addData(memoryTree, {}, memoryTree.size/4);
  const [result2, address2] = memory.addData(result1, {}, memoryTree.size/4);
  const result3 = memory.clearData(result2, address1);
  const result4 = memory.clearData(result3, address2);
  t.is(result4, null);
});

test('when requesting a quarter of the memory twice, then releasing both quarters of the memory in reverse order', t => {
  const memoryTree = createMemoryTree();
  const [result1, address1] = memory.addData(memoryTree, {}, memoryTree.size/4);
  const [result2, address2] = memory.addData(result1, {}, memoryTree.size/4);
  const result3 = memory.clearData(result2, address2);
  const result4 = memory.clearData(result3, address1);
  t.is(result4, null);
});

test('when requesting 1 block', t => {
  const memoryTree = createMemoryTree();
  const [result, address] = memory.addData(memoryTree, {}, 1);
  t.not(result, memoryTree);
  t.is(address, 0);
});

test('when changing the data', t => {
  const memoryTree = createMemoryTree();
  const [result1, address] = memory.addData(memoryTree, {}, memoryTree.size/2);
  const data = {};
  const result2 = memory.setData(result1, address, data);
  t.not(result1, result2);
  t.is(result2.left.data, data);
})

test('serialize empty', t => {
  const memoryTree = createMemoryTree();
  t.deepEqual(memory.serialize(memoryTree), []);
});

test('serialize 1', t => {
  const memoryTree = createMemoryTree();
  memory.allocate(memoryTree, 1);
  t.deepEqual(memory.serialize(memoryTree), [1]);
});

test('serialize 1,4', t => {
  const memoryTree = createMemoryTree();
  memory.allocate(memoryTree, 1);
  memory.allocate(memoryTree, 4);
  t.deepEqual(memory.serialize(memoryTree), [1,4]);
});

test('deserialize empty', t => {
  const memoryTree = createMemoryTree();
  t.deepEqual(memory.deserialize(memoryTree.size, []), memoryTree);
});

test('deserialize 1', t => {
  const memoryTree = createMemoryTree();
  memory.allocate(memoryTree, 1);
  t.deepEqual(memory.deserialize(memoryTree.size, [1]), memoryTree);
});

test('serialize 1,4', t => {
  const memoryTree = createMemoryTree();
  memory.allocate(memoryTree, 1);
  memory.allocate(memoryTree, 4);
  t.deepEqual(memory.deserialize(memoryTree.size, [1,4]), memoryTree);
});


function createMemoryTree(size=16){
  return memory.createFromSize(size);
}