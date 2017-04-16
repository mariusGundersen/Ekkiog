import * as React from 'react';

import PieSector from './PieSector';

import { MenuItem } from './menuItems';

export interface Props {
  fromTurnFraction : number;
  toTurnFraction : number;
  radius : number;
  width : number;
  show : boolean;
  menuItems : MenuItem[];
  ringKey : number;
}

export default ({
  fromTurnFraction,
  toTurnFraction,
  radius,
  width,
  show,
  menuItems,
  ringKey
} : Props) => {
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
