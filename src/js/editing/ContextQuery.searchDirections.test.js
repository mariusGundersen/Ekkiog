import test from 'ava';

import {WIRE, GATE, UNDERPASS} from './tileConstants.js';
import ContextQuery from './ContextQuery.js';

function getSearchDirections(t, map, start, expected){
  const cq = new ContextQuery(makeContext(map));
  const actual = [...cq.getSearchDirections(...start)];
  t.deepEqual(actual, expected);
}

getSearchDirections.title = t => 'GetSearchDirections '+t;

test(
  'null test',
  getSearchDirections,
  `000
   0x0
   000`,
  [1, 1, 0],
  []);

test(
  'lone wire',
  getSearchDirections,
  `000
   0x0
   000`,
  [1, 1, WIRE],
  []);

test(
  'wire with friends',
  getSearchDirections,
  `010
   1x1
   010`,
  [1, 1, WIRE],
  [[0,1],[2,1],[1,0],[1,2]]);

test(
  'wire with inputB and output',
  getSearchDirections,
  `000000
   2x0000
   000002`,
  [1, 1, WIRE],
  [[0,1],[2,1]]);

test(
  'wire with inputA and output',
  getSearchDirections,
  `000002
   2x0000
   000000`,
  [1, 1, WIRE],
  [[0,1],[2,1]]);

test(
  'wire above input',
  getSearchDirections,
  `000000
   0x0000
   000000
   000002`,
  [1, 1, WIRE],
  []);

test(
  'wire below input',
  getSearchDirections,
  `000002
   000000
   0x0000
   000000`,
  [1, 2, WIRE],
  []);

test(
  'wire next to underpass',
  getSearchDirections,
  `000
   3x3
   000`,
  [1, 1, WIRE],
  [[0,1],[2,1]]);

test(
  'wire below underpass',
  getSearchDirections,
  `010
   030
   0x0
   000`,
  [1, 2, WIRE],
  [[1,0]]);

test(
  'wire above underpass',
  getSearchDirections,
  `000
   0x0
   030
   010`,
  [1, 1, WIRE],
  [[1,3]]);

test(
  'wire below long underpass',
  getSearchDirections,
  `010
   030
   030
   030
   0x0
   000`,
  [1, 4, WIRE],
  [[1,0]]);

test(
  'wire above long underpass',
  getSearchDirections,
  `000
   0x0
   030
   030
   030
   010`,
  [1, 1, WIRE],
  [[1,5]]);

test(
  'lone underpass',
  getSearchDirections,
  `000
   0x0
   000`,
  [1, 1, UNDERPASS],
  []);

test(
  'underpass with friends',
  getSearchDirections,
  `010
   1x1
   010`,
  [1, 1, UNDERPASS],
  [[0,1],[2,1]]);

test(
  'underpass with other underpasses',
  getSearchDirections,
  `010
   030
   3x3
   030
   010`,
  [1, 2, UNDERPASS],
  [[0,2],[2,2]]);

test(
  'underpass with inputB and output',
  getSearchDirections,
  `000000
   2x0000
   000002`,
  [1, 1, UNDERPASS],
  [[0,1],[2,1]]);

test(
  'underpass with inputA and output',
  getSearchDirections,
  `000002
   2x0000
   000000`,
  [1, 1, UNDERPASS],
  [[0,1],[2,1]]);

test(
  'lone gate',
  getSearchDirections,
  `000
   0x0
   000`,
  [1, 1, GATE],
  []);

test(
  'gate feeding into wire',
  getSearchDirections,
  `000
   0x1
   000`,
  [1, 1, GATE],
  [[2,1]]);

test(
  'gate feeding into underpass',
  getSearchDirections,
  `000
   0x3
   000`,
  [1, 1, GATE],
  [[2,1]]);

test(
  'gate feeding into another gate below',
  getSearchDirections,
  `000000
   0x0000
   000002`,
  [1, 1, GATE],
  [[2,1]]);

test(
  'gate feeding into another gate above',
  getSearchDirections,
  `000002
   0x0000
   000000`,
  [1, 1, GATE],
  [[2,1]]);

function makeContext(t){
  const lines = t.split('\n').map(l => l.replace(/\s/g, '')).filter(l => l.length != 0);
  return {
    width: lines[0].length,
    height: lines.length,
    mapTexture: {
      map: {
        get(y, x, c){
          if(y<0 || x<0) return 0;
          return c == 0 ? lines[y][x]*1 : 0;
        }
      }
    }
  };
}