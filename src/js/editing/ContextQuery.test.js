import test from 'ava';

import ContextQuery from './ContextQuery.js';

const cq = new ContextQuery({
  width: 20,
  height: 20,
  mapTexture: makeMapTexture(`
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
    0 0 0 0 4 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
  `),
  netMapTexture: makeMapTexture(`
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
    0 0 0 0 4 0 0 0 0 0 0 0 0 0 0 7 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
  `)
});

test('isWire', t => {
  t.true(cq.isWire(2,1));
  t.false(cq.isWire(1,2));
});

test('isEmpty', t => {
  t.true(cq.isEmpty(1,1));
  t.false(cq.isEmpty(2,1));
  t.false(cq.isEmpty(9, 6));
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

  t.false(cq.isGate(10, 6));
  t.true(cq.isGate(10, 7));
  t.false(cq.isGate(10, 8));

  t.false(cq.isGate(11, 7));
});

test('isUnderpass', t => {
  t.true(cq.isUnderpass(15, 2));
  t.false(cq.isUnderpass(2, 1));
  t.false(cq.isUnderpass(0, 0));
});

test('isButtonOutput', t => {
  t.true(cq.isButtonOutput(4, 13));
  t.false(cq.isButtonOutput(4, 12));
});

test('isButton', t => {
  t.true(cq.isButton(2, 12));
  t.true(cq.isButton(2, 13));
  t.true(cq.isButton(2, 14));

  t.true(cq.isButton(3, 12));
  t.true(cq.isButton(3, 13));
  t.true(cq.isButton(3, 14));

  t.true(cq.isButton(4, 12));
  t.true(cq.isButton(4, 13));
  t.true(cq.isButton(4, 14));

  t.false(cq.isButton(4, 11));
});

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
  t.deepEqual(cq.getNetSource(4), [4, 13]);
});

test('canPlaceGateHere', t => {
  //Gate at 10, 7
  t.true(cq.canPlaceGateHere(7, 5));
  t.false(cq.canPlaceGateHere(7, 6));
  t.false(cq.canPlaceGateHere(7, 7));
  t.false(cq.canPlaceGateHere(7, 8));
  t.true(cq.canPlaceGateHere(7, 9));

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

  t.true(cq.canPlaceGateHere(13, 5));
  t.false(cq.canPlaceGateHere(13, 6));
  t.false(cq.canPlaceGateHere(13, 7));
  t.false(cq.canPlaceGateHere(13, 8));
  t.true(cq.canPlaceGateHere(13, 9));

  t.true(cq.canPlaceGateHere(14, 7));

  //Button at 4, 13
  t.true(cq.canPlaceGateHere(2, 11));
  t.false(cq.canPlaceGateHere(2, 12));
  t.false(cq.canPlaceGateHere(2, 13));
  t.false(cq.canPlaceGateHere(2, 14));
  t.true(cq.canPlaceGateHere(2, 15));

  t.false(cq.canPlaceGateHere(3, 11));
  t.false(cq.canPlaceGateHere(3, 12));
  t.false(cq.canPlaceGateHere(3, 13));
  t.false(cq.canPlaceGateHere(3, 14));
  t.false(cq.canPlaceGateHere(3, 15));

  t.false(cq.canPlaceGateHere(4, 11));
  t.false(cq.canPlaceGateHere(4, 12));
  t.false(cq.canPlaceGateHere(4, 13));
  t.false(cq.canPlaceGateHere(4, 14));
  t.false(cq.canPlaceGateHere(4, 15));

  t.false(cq.canPlaceGateHere(5, 11));
  t.false(cq.canPlaceGateHere(5, 12));
  t.false(cq.canPlaceGateHere(5, 13));
  t.false(cq.canPlaceGateHere(5, 14));
  t.false(cq.canPlaceGateHere(5, 15));

  t.false(cq.canPlaceGateHere(6, 11));
  t.false(cq.canPlaceGateHere(6, 12));
  t.false(cq.canPlaceGateHere(6, 13));
  t.false(cq.canPlaceGateHere(6, 14));
  t.false(cq.canPlaceGateHere(6, 15));

  t.false(cq.canPlaceGateHere(7, 11));
  t.false(cq.canPlaceGateHere(7, 12));
  t.false(cq.canPlaceGateHere(7, 13));
  t.false(cq.canPlaceGateHere(7, 14));
  t.false(cq.canPlaceGateHere(7, 15));
});

test('canPlaceButtonHere', t => {
  //Gate at 10, 7
  t.false(cq.canPlaceButtonHere(7, 5));
  t.false(cq.canPlaceButtonHere(7, 6));
  t.false(cq.canPlaceButtonHere(7, 7));
  t.false(cq.canPlaceButtonHere(7, 8));
  t.false(cq.canPlaceButtonHere(7, 9));

  t.false(cq.canPlaceButtonHere(8, 5));
  t.false(cq.canPlaceButtonHere(8, 6));
  t.false(cq.canPlaceButtonHere(8, 7));
  t.false(cq.canPlaceButtonHere(8, 8));
  t.false(cq.canPlaceButtonHere(8, 9));

  t.false(cq.canPlaceButtonHere(9, 5));
  t.false(cq.canPlaceButtonHere(9, 6));
  t.false(cq.canPlaceButtonHere(9, 7));
  t.false(cq.canPlaceButtonHere(9, 8));
  t.false(cq.canPlaceButtonHere(9, 9));

  t.false(cq.canPlaceButtonHere(10, 5));
  t.false(cq.canPlaceButtonHere(10, 6));
  t.false(cq.canPlaceButtonHere(10, 7));
  t.false(cq.canPlaceButtonHere(10, 8));
  t.false(cq.canPlaceButtonHere(10, 9));

  t.false(cq.canPlaceButtonHere(11, 5));
  t.false(cq.canPlaceButtonHere(11, 6));
  t.false(cq.canPlaceButtonHere(11, 7));
  t.false(cq.canPlaceButtonHere(11, 8));
  t.false(cq.canPlaceButtonHere(11, 9));

  t.true(cq.canPlaceButtonHere(12, 5));
  t.false(cq.canPlaceButtonHere(12, 6));
  t.false(cq.canPlaceButtonHere(12, 7));
  t.false(cq.canPlaceButtonHere(12, 8));
  t.true(cq.canPlaceButtonHere(12, 9));

  t.true(cq.canPlaceButtonHere(13, 5));
  t.true(cq.canPlaceButtonHere(13, 6));
  t.true(cq.canPlaceButtonHere(13, 7));
  t.true(cq.canPlaceButtonHere(13, 8));
  t.true(cq.canPlaceButtonHere(13, 9));

  t.true(cq.canPlaceButtonHere(14, 7));

  //Button at 4, 13
  t.false(cq.canPlaceButtonHere(2, 11));
  t.false(cq.canPlaceButtonHere(2, 12));
  t.false(cq.canPlaceButtonHere(2, 13));
  t.false(cq.canPlaceButtonHere(2, 14));
  t.false(cq.canPlaceButtonHere(2, 15));

  t.false(cq.canPlaceButtonHere(3, 11));
  t.false(cq.canPlaceButtonHere(3, 12));
  t.false(cq.canPlaceButtonHere(3, 13));
  t.false(cq.canPlaceButtonHere(3, 14));
  t.false(cq.canPlaceButtonHere(3, 15));

  t.false(cq.canPlaceButtonHere(4, 11));
  t.false(cq.canPlaceButtonHere(4, 12));
  t.false(cq.canPlaceButtonHere(4, 13));
  t.false(cq.canPlaceButtonHere(4, 14));
  t.false(cq.canPlaceButtonHere(4, 15));

  t.false(cq.canPlaceButtonHere(5, 11));
  t.false(cq.canPlaceButtonHere(5, 12));
  t.false(cq.canPlaceButtonHere(5, 13));
  t.false(cq.canPlaceButtonHere(5, 14));
  t.false(cq.canPlaceButtonHere(5, 15));

  t.false(cq.canPlaceButtonHere(6, 11));
  t.false(cq.canPlaceButtonHere(6, 12));
  t.false(cq.canPlaceButtonHere(6, 13));
  t.false(cq.canPlaceButtonHere(6, 14));
  t.false(cq.canPlaceButtonHere(6, 15));

  t.true(cq.canPlaceButtonHere(7, 11));
  t.true(cq.canPlaceButtonHere(7, 12));
  t.true(cq.canPlaceButtonHere(7, 13));
  t.true(cq.canPlaceButtonHere(7, 14));
  t.true(cq.canPlaceButtonHere(7, 15));
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
    get(x, y){
      if(y<0 || x<0) return 0;
      return lines[y][x]*1;
    }
  }
}