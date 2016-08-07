import React from 'react';

import PieSector from './PieSector.jsx';

export default ({
  fromTurnFraction,
  toTurnFraction,
  radius,
  width,
  show,
  menuItems,
  ringKey
}) => {
  const sectionTurnFraction = (toTurnFraction-fromTurnFraction)/menuItems.length;
  return (
    <g key={ringKey}>
      {menuItems.map((item, index) => (
        <PieSector
          key={item.itemKey}
          innerRadius={radius}
          outerRadius={radius+width + (item.selected ? 10 : 0)}
          selected={false}
          turnFractionCenter={show ? fromTurnFraction + sectionTurnFraction/2 + sectionTurnFraction*index : 1/4}
          turnFractionSection={sectionTurnFraction}
          gap={item.selected && show ? 0 : 5}
          {...item} />
      ))}
    </g>
  );
};
