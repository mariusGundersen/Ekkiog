import test from 'ava';

import ContextQuery from './ContextQuery.js';

const cq = new ContextQuery({
  width: 20,
  height: 20,
  mapTexture: {
    map: makeMapTexture(`
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 2 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    `)
  },
  netMapTexture: {
    map: makeMapTexture(`
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 8 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 4 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 5 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 6 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 7 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    `)
  }
});

test('isWire', t => {
  t.true(cq.isWire(2,1));
  t.false(cq.isWire(1,2));
});

test('isGateOutput', t => {
  t.true(cq.isGateOutput(10, 7));
  t.false(cq.isGateOutput(10, 8));
});

test('isGateInput', t => {
  t.true(cq.isGateInput(7, 6));
  t.true(cq.isGateInput(7, 8));
  t.false(cq.isGateInput(7, 7));
});

test('isGate', t => {
  t.true(cq.isGate(7, 6));
  t.true(cq.isGate(7, 7));
  t.true(cq.isGate(7, 8));

  t.true(cq.isGate(8, 6));
  t.true(cq.isGate(8, 7));
  t.true(cq.isGate(8, 8));

  t.true(cq.isGate(9, 6));
  t.true(cq.isGate(9, 7));
  t.true(cq.isGate(9, 8));

  t.true(cq.isGate(10, 6));
  t.true(cq.isGate(10, 7));
  t.true(cq.isGate(10, 8));

  t.false(cq.isGate(11, 7));
});

test('isUnderpass', t => {
  t.true(cq.isUnderpass(15, 2));
  t.false(cq.isUnderpass(2, 1));
  t.false(cq.isUnderpass(0, 0));
})

test('isGroundNet', t => {
  t.true(cq.isGroundNet(0,0));
  t.false(cq.isGroundNet(2,1));
});

test('getNet', t => {
  t.is(cq.getNet(0,0), 0);
  t.is(cq.getNet(2,1), 1);
});

test('getNetSource', t => {
  t.deepEqual(cq.getNetSource(1), [10, 7]);
  t.deepEqual(cq.getNetSource(0), [-1, -1]);
});

test('canPlaceGateHere', t => {
  //Gate at 10, 7
  t.false(cq.canPlaceGateHere(7, 5));
  t.false(cq.canPlaceGateHere(7, 6));
  t.false(cq.canPlaceGateHere(7, 7));
  t.false(cq.canPlaceGateHere(7, 8));
  t.false(cq.canPlaceGateHere(7, 9));

  t.false(cq.canPlaceGateHere(8, 5));
  t.false(cq.canPlaceGateHere(8, 6));
  t.false(cq.canPlaceGateHere(8, 7));
  t.false(cq.canPlaceGateHere(8, 8));
  t.false(cq.canPlaceGateHere(8, 9));

  t.false(cq.canPlaceGateHere(9, 5));
  t.false(cq.canPlaceGateHere(9, 6));
  t.false(cq.canPlaceGateHere(9, 7));
  t.false(cq.canPlaceGateHere(9, 8));
  t.false(cq.canPlaceGateHere(9, 9));

  t.false(cq.canPlaceGateHere(10, 5));
  t.false(cq.canPlaceGateHere(10, 6));
  t.false(cq.canPlaceGateHere(10, 7));
  t.false(cq.canPlaceGateHere(10, 8));
  t.false(cq.canPlaceGateHere(10, 9));

  t.false(cq.canPlaceGateHere(11, 5));
  t.false(cq.canPlaceGateHere(11, 6));
  t.false(cq.canPlaceGateHere(11, 7));
  t.false(cq.canPlaceGateHere(11, 8));
  t.false(cq.canPlaceGateHere(11, 9));

  t.false(cq.canPlaceGateHere(12, 5));
  t.false(cq.canPlaceGateHere(12, 6));
  t.false(cq.canPlaceGateHere(12, 7));
  t.false(cq.canPlaceGateHere(12, 8));
  t.false(cq.canPlaceGateHere(12, 9));

  t.false(cq.canPlaceGateHere(13, 5));
  t.false(cq.canPlaceGateHere(13, 6));
  t.false(cq.canPlaceGateHere(13, 7));
  t.false(cq.canPlaceGateHere(13, 8));
  t.false(cq.canPlaceGateHere(13, 9));

  t.true(cq.canPlaceGateHere(14, 7));
});

test('getNextNet', t => {
  t.is(cq.getNextNet(), 2);
});

test('getUnderpassTerminalAbove', t => {
  t.is(cq.getUnderpassTerminalAbove(15, 2), 1);
  t.is(cq.getUnderpassTerminalAbove(15, 12), 9);
});

test('getUnderpassTerminalBelow', t => {
  t.is(cq.getUnderpassTerminalBelow(15, 2), 3);
  t.is(cq.getUnderpassTerminalBelow(15, 10), 13);
});

test('getUnderpassTerminalNets', t => {
  t.deepEqual(cq.getUnderpassTerminalNets(15, 2), []);
  t.deepEqual(cq.getUnderpassTerminalNets(15, 11), [8,7]);
})

function makeMapTexture(t){
  const lines = t.split('\n').map(l => l.replace(/\s/g, '')).filter(l => l.length != 0);
  return {
    get(y, x, c){
      if(y<0 || x<0) return 0;
      return c == 0 ? lines[y][x]*1 : 0;
    }
  }
}