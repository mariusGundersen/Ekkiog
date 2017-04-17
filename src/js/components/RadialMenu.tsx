import * as React from 'react';

import PieRing, { Props as PieRingProps } from './radialMenu/PieRing';
import PieCenter, { Props as PieCenterProps } from './radialMenu/PieCenter';

export interface Props {
  cx : number;
  cy : number;
  showMenu : boolean;
  center? : PieCenterProps,
  menuTree : PieRingProps[]
}

export { PieRingProps, PieCenterProps };

export default ({
  cx,
  cy,
  showMenu,
  center,
  menuTree
} : Props) => {
  return (
    <g transform={`translate(${cx}, ${cy})`}>

      {center != undefined ? <PieCenter {...center} /> : null}

      {menuTree.map(ring => <PieRing key={ring.ringKey} {...ring} />)}

    </g>
  );
}