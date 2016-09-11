import test from 'ava';
import * as memory from './memory.js';

test('when filling up the memory it should mark sections correctly', t => {
  var memoryTree = createMemoryTree();
  memory.setUsed(memoryTree, 0);
  t.is(memoryTree[0], 1);
  t.is(memoryTree[1], 0);

  memory.setUsed(memoryTree, 1);
  t.is(memoryTree[0], 3);
  t.is(memoryTree[1], 1);

  memory.setUsed(memoryTree, 2);
  t.is(memoryTree[0], 3);
  t.is(memoryTree[1], 1);
  t.is(memoryTree[2], 1);
  t.is(memoryTree[3], 0);

  memory.setUsed(memoryTree, 3);
  t.is(memoryTree[0], 7);
  t.is(memoryTree[1], 1);
  t.is(memoryTree[2], 3);
  t.is(memoryTree[3], 1);

  memory.setUsed(memoryTree, 7);
  t.is(memoryTree[0], 7);
  t.is(memoryTree[1], 1);
  t.is(memoryTree[2], 3);
  t.is(memoryTree[3], 1);
  t.is(memoryTree[4], 0);
  t.is(memoryTree[5], 0);
  t.is(memoryTree[6], 0);
  t.is(memoryTree[7], 1);

  memory.setUsed(memoryTree, 6);
  t.is(memoryTree[0], 7);
  t.is(memoryTree[1], 1);
  t.is(memoryTree[2], 3);
  t.is(memoryTree[3], 1);
  t.is(memoryTree[4], 0);
  t.is(memoryTree[5], 0);
  t.is(memoryTree[6], 3);
  t.is(memoryTree[7], 1);

  memory.setUsed(memoryTree, 5);
  t.is(memoryTree[0], 7);
  t.is(memoryTree[1], 1);
  t.is(memoryTree[2], 3);
  t.is(memoryTree[3], 1);
  t.is(memoryTree[4], 0);
  t.is(memoryTree[5], 1);
  t.is(memoryTree[6], 3);
  t.is(memoryTree[7], 1);

  memory.setUsed(memoryTree, 4);
  t.is(memoryTree[0], 15);
  t.is(memoryTree[1], 1);
  t.is(memoryTree[2], 3);
  t.is(memoryTree[3], 1);
  t.is(memoryTree[4], 7);
  t.is(memoryTree[5], 1);
  t.is(memoryTree[6], 3);
  t.is(memoryTree[7], 1);
});

test('when clearing memory it should mark sections correctly', t => {
  var memoryTree = createMemoryTree();

  memoryTree[0] = 1;
  memoryTree[1] = 0;
  memory.clearUsed(memoryTree, 0);
  t.is(memoryTree[0], 0);
  t.is(memoryTree[1], 0);

  memoryTree[0] = 0;
  memoryTree[1] = 1;
  memory.clearUsed(memoryTree, 1);
  t.is(memoryTree[0], 0);
  t.is(memoryTree[1], 0);

  memoryTree[0] = 3;
  memoryTree[1] = 1;
  memory.clearUsed(memoryTree, 0);
  t.is(memoryTree[0], 0);
  t.is(memoryTree[1], 1);

  memoryTree[0] = 3;
  memoryTree[1] = 1;
  memory.clearUsed(memoryTree, 1);
  t.is(memoryTree[0], 1);
  t.is(memoryTree[1], 0);

  memoryTree[0] = 7;
  memoryTree[1] = 1;
  memoryTree[2] = 3;
  memoryTree[3] = 1;
  memory.clearUsed(memoryTree, 0);
  t.is(memoryTree[0], 0);
  t.is(memoryTree[1], 1);
  t.is(memoryTree[2], 3);
  t.is(memoryTree[3], 1);

  memoryTree[0] = 7;
  memoryTree[1] = 1;
  memoryTree[2] = 3;
  memoryTree[3] = 1;
  memory.clearUsed(memoryTree, 1);
  t.is(memoryTree[0], 1);
  t.is(memoryTree[1], 0);
  t.is(memoryTree[2], 3);
  t.is(memoryTree[3], 1);

  memoryTree[0] = 7;
  memoryTree[1] = 1;
  memoryTree[2] = 3;
  memoryTree[3] = 1;
  memory.clearUsed(memoryTree, 2);
  t.is(memoryTree[0], 3);
  t.is(memoryTree[1], 1);
  t.is(memoryTree[2], 0);
  t.is(memoryTree[3], 1);

  memoryTree[0] = 7;
  memoryTree[1] = 1;
  memoryTree[2] = 3;
  memoryTree[3] = 1;
  memory.clearUsed(memoryTree, 3);
  t.is(memoryTree[0], 3);
  t.is(memoryTree[1], 1);
  t.is(memoryTree[2], 1);
  t.is(memoryTree[3], 0);

  memoryTree[0] = 15;
  memoryTree[1] = 1;
  memoryTree[2] = 3;
  memoryTree[3] = 1;
  memoryTree[4] = 7;
  memoryTree[5] = 1;
  memoryTree[6] = 3;
  memoryTree[7] = 1;
  memory.clearUsed(memoryTree, 7);
  t.is(memoryTree[0], 7);
  t.is(memoryTree[1], 1);
  t.is(memoryTree[2], 3);
  t.is(memoryTree[3], 1);
  t.is(memoryTree[4], 3);
  t.is(memoryTree[5], 1);
  t.is(memoryTree[6], 1);
  t.is(memoryTree[7], 0);
});

test('find free address returns 0 when empty', t => {
  var memoryTree = createMemoryTree();

  t.is(memory.findFreeAddress(memoryTree), 0);
});

test('find free address returns 1 when 0 is used', t => {
  var memoryTree = createMemoryTree();

  memoryTree[0] = 1;

  t.is(memory.findFreeAddress(memoryTree), 1);
});

test('find free address returns 2 when 0 and 1 is used', t => {
  var memoryTree = createMemoryTree();

  memoryTree[0] = 2;

  t.is(memory.findFreeAddress(memoryTree), 2);
});

test('find free address returns 4 when first four gates are used', t => {
  var memoryTree = createMemoryTree();

  memoryTree[0] = 4;

  t.is(memory.findFreeAddress(memoryTree), 4);
});

test('find free address returns 6 when first six gates are used', t => {
  var memoryTree = createMemoryTree();

  memoryTree[0] = 4;
  memoryTree[4] = 2;

  t.is(memory.findFreeAddress(memoryTree), 6);
});

test('when using up three bits, it should allocate 4 bits', t => {
  var memoryTree = createMemoryTree();

  memory.setUsed(memoryTree, 0, 3);
  t.is(memoryTree[0], 4);
});

test('clearing up three bits, it should deallocate 4 bits', t => {
  var memoryTree = createMemoryTree();

  memoryTree[0] = 4;
  memory.clearUsed(memoryTree, 0, 3);
  t.is(memoryTree[0], 0);
});

test('find free address returns 4 when first gate is used and it looks for 4 free gates', t => {
  var memoryTree = createMemoryTree();

  memoryTree[0] = 1;

  t.is(memory.findFreeAddress(memoryTree, 3), 4);
});

test('find free address returns 8 when first and fifth gate is used and it looks for 4 free gates', t => {
  var memoryTree = createMemoryTree();

  memoryTree[0] = 1;
  memoryTree[4] = 1;

  t.is(memory.findFreeAddress(memoryTree, 3), 8);
});

test('find free address returns 8 when first 8 gates are used and it looks for 4 free gates', t => {
  var memoryTree = createMemoryTree();

  memoryTree[0] = 8;

  t.is(memory.findFreeAddress(memoryTree, 3), 8);
});

function createMemoryTree(size=16){
  return  new Uint32Array(size);
}