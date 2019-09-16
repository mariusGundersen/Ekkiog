import * as React from 'react';

import PieSector from './PieSector';

import { MenuItem } from './menuItems';

export interface Props {
  readonly fromTurnFraction: number;
  readonly toTurnFraction: number;
  readonly spanTurnFraction?: number;
  readonly radius: number;
  readonly width: number;
  readonly show: boolean;
  readonly menuItems: MenuItem[];
}

export default ({
  fromTurnFraction,
  toTurnFraction,
  radius,
  width,
  show,
  menuItems,
  spanTurnFraction = (toTurnFraction - fromTurnFraction) / menuItems.length,
}: Props) => {
  const sectionTurnFraction = (toTurnFraction - fromTurnFraction) / menuItems.length;
  return (
    <g>
      {menuItems.map((item, index) => (
        <PieSector
          key={item.itemKey}
          innerRadius={radius}
          outerRadius={radius + width + (item.selected ? 10 : 0)}
          selected={false}
          turnFractionCenter={show ? fromTurnFraction + sectionTurnFraction / 2 + sectionTurnFraction * index : 1 / 4}
          turnFractionSection={spanTurnFraction}
          gap={item.selected && show ? 0 : 5}
          {...item} />
      ))}
    </g>
  );
};
