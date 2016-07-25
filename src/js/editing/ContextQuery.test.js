import test from 'ava';

import ContextQuery from './ContextQuery.js';

const cq = new ContextQuery({
  width: 20,
  height: 20,
  mapTexture: {
    map: {
      get(y,x,c){
        if(y==1 && x==2 && c==0 ){
          return 1;//WIRE
        }

        if(y==7 && x==10 && c==0){
          return 2;//GATE
        }

        return 0;
      }
    }
  },
  netMapTexture: {
    map: {
      get(y,x,c){
        if(y==1 && x==2 && c==0 ){
          return 1;
        }

        if(y==7 && x==10 && c==0){
          return 1;
        }

        return 0;
      }
    }
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