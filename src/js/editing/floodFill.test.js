import test from 'ava';

import floodFill from './floodFill.js';

test.skip('floodFill should not call fill when condition returns false', t => {
  floodFill(0,0, 1,1, () => false, () => t.fail());
  t.pass();
});


test.skip('floodFill should check in four directions', t => {
  t.plan(5);
  const expectedFills = ['1|1','2|1','0|1','1|2','1|0'];
  floodFill(1,1, 3,3, (x,y) => x == 1 || y == 1, (x,y) => t.true(expectedFills.indexOf(x+'|'+y) >= 0));
});