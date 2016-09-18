import test from 'ava';
import * as memory from './memory.js';

test('when requesting the full memory', t => {
  const memoryTree = createMemoryTree();
  const address = memory.allocate(memoryTree, memoryTree.size);
  t.is(address, 0);
  t.true(memoryTree.used);
});

test('when requesting the full memory twice', t => {
  const memoryTree = createMemoryTree();
  const address1 = memory.allocate(memoryTree, memoryTree.size);
  const address2 = memory.allocate(memoryTree, memoryTree.size);
  t.is(address2, -1);
});

test('when requesting half the memory', t => {
  const memoryTree = createMemoryTree();
  const address = memory.allocate(memoryTree, memoryTree.size/2);
  t.is(address, 0);
  t.false(memoryTree.used);
  t.truthy(memoryTree.left);
  t.falsy(memoryTree.right);
  t.true(memoryTree.left.used);
});

test('when requesting half the memory twice', t => {
  const memoryTree = createMemoryTree();
  const address1 = memory.allocate(memoryTree, memoryTree.size/2);
  const address2 = memory.allocate(memoryTree, memoryTree.size/2);
  t.is(address1, 0);
  t.is(address2, memoryTree.size/2);
  t.false(memoryTree.used);
  t.truthy(memoryTree.left);
  t.truthy(memoryTree.right);
  t.true(memoryTree.left.used);
  t.true(memoryTree.right.used);
});

test('when requesting half the memory then the full memory', t => {
  const memoryTree = createMemoryTree();
  const address1 = memory.allocate(memoryTree, memoryTree.size/2);
  const address2 = memory.allocate(memoryTree, memoryTree.size);
  t.is(address1, 0);
  t.is(address2, -1);
  t.false(memoryTree.used);
  t.truthy(memoryTree.left);
  t.falsy(memoryTree.right);
  t.true(memoryTree.left.used);
});

test('when requesting a bit less than half the memory', t => {
  const memoryTree = createMemoryTree();
  const address1 = memory.allocate(memoryTree, memoryTree.size/2-1);
  t.is(address1, 0);
  t.false(memoryTree.used);
  t.truthy(memoryTree.left);
  t.falsy(memoryTree.right);
  t.true(memoryTree.left.used);
});

test('when releasing the full memory', t => {
  const memoryTree = createMemoryTree();
  memoryTree.used = true;
  memory.deallocate(memoryTree, memoryTree.address, memoryTree.size);
  t.false(memoryTree.used);
});

test('when requesting then releasing half the memory', t => {
  const memoryTree = createMemoryTree();
  const address = memory.allocate(memoryTree, memoryTree.size/2);
  memory.deallocate(memoryTree, address, memoryTree.size/2);
  t.false(memoryTree.used);
  t.falsy(memoryTree.left);
  t.falsy(memoryTree.right);
});

test('when requesting half the memory twice, then releasing the second half of the memory', t => {
  const memoryTree = createMemoryTree();
  const address1 = memory.allocate(memoryTree, memoryTree.size/2);
  const address2 = memory.allocate(memoryTree, memoryTree.size/2);
  memory.deallocate(memoryTree, address2, memoryTree.size/2);
  t.false(memoryTree.used);
  t.truthy(memoryTree.left);
  t.falsy(memoryTree.right);
  t.true(memoryTree.left.used);
});

test('when requesting half the memory twice, then releasing both halves of the memory', t => {
  const memoryTree = createMemoryTree();
  const address1 = memory.allocate(memoryTree, memoryTree.size/2);
  const address2 = memory.allocate(memoryTree, memoryTree.size/2);
  memory.deallocate(memoryTree, address2, memoryTree.size/2);
  memory.deallocate(memoryTree, address1, memoryTree.size/2);
  t.false(memoryTree.used);
  t.falsy(memoryTree.left);
  t.falsy(memoryTree.right);
});

test('when requesting a quarter of the memory twice, then releasing one quarters of the memory', t => {
  const memoryTree = createMemoryTree();
  const address1 = memory.allocate(memoryTree, memoryTree.size/4);
  const address2 = memory.allocate(memoryTree, memoryTree.size/4);
  memory.deallocate(memoryTree, address2, memoryTree.size/4);
  t.false(memoryTree.used);
  t.truthy(memoryTree.left);
  t.falsy(memoryTree.right);
  t.false(memoryTree.left.used);
  t.truthy(memoryTree.left.left);
  t.falsy(memoryTree.left.right);
  t.true(memoryTree.left.left.used);
});

test('when requesting a quarter of the memory twice, then releasing both quarters of the memory', t => {
  const memoryTree = createMemoryTree();
  const address1 = memory.allocate(memoryTree, memoryTree.size/4);
  const address2 = memory.allocate(memoryTree, memoryTree.size/4);
  memory.deallocate(memoryTree, address2, memoryTree.size/4);
  memory.deallocate(memoryTree, address1, memoryTree.size/4);
  t.false(memoryTree.used);
  t.falsy(memoryTree.left);
  t.falsy(memoryTree.right);
});

test('when requesting 1 block', t => {
  const memoryTree = createMemoryTree();
  const address = memory.allocate(memoryTree, 1);
  t.is(address, 0);
});

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