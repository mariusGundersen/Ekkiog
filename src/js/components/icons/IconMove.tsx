import * as React from 'react';

const A = 10;
const B = 2;
const C = 4;
const D = B+C;

export default (props : {}) => (
  <g>
    <path
      stroke="none"
      fill="white"
      strokeWidth="0"
      d={`M${B},${-B} L${A},${-B} l0,${-C} l${D},${D}  l${-D},${D}  l0,${-C}
         L${B},${B}  L${B},${A}  l${C},0  l${-D},${D} l${-D},${-D} l${C},0
         L${-B},${B} L${-A},${B} l0,${C} l${-D},${-D}  l${D},${-D}  l0,${C}
         L${-B},${-B}  L${-B},${-A}  l${-C},0  l${D},${-D} l${D},${D} l${-C},0
         Z`}
    />
  </g>
);