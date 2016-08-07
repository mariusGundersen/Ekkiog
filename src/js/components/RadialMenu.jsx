import React from 'react';

import PieRing from './radialMenu/PieRing.jsx';
import PieCenter from './radialMenu/PieCenter.jsx';

export default ({
  cx,
  cy,
  showMenu,
  selectedTool,
  onClick,
  onToolSelected,
  center,
  menuTree
}) => {
  return (
    <g transform={`translate(${cx}, ${cy})`}>

      <PieCenter {...center} />

      {menuTree.map(ring => <PieRing key={ring.radius} {...ring} />)}

    </g>
  );
}