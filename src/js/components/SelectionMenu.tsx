import * as React from 'react';
import { Dispatch } from 'redux';
import { TileType, Direction } from '../editing';

import RadialMenu from './radialMenu';

import {
  rotateSelectionMenuItem
} from './radialMenu/menuItems';
import { Action } from '../actions';
import PieRing from './radialMenu/PieRing';
import pure from './pure';
import IconLight from './icons/IconLight';
import IconButton from './icons/IconButton';
import { RADIUS } from './Menu';

export interface Props {
  readonly tileType: TileType;
  readonly permanent?: boolean;
  readonly dispatch: Dispatch<Action>;
  readonly direction: Direction;
  readonly x: number;
  readonly y: number;
}

export default pure<Props>(['x', 'y', 'direction'], props => (
  <g transform={`translate(${props.x} ${props.y})`}>
    <RadialMenu cx={0} cy={0}>
      <PieRing
        key={1}
        radius={RADIUS * 2}
        width={RADIUS}
        fromTurnFraction={0.125}
        toTurnFraction={1.125}
        spanTurnFraction={0.125}
        show={true}
        menuItems={[...rotateMenuItems(props.tileType, props.permanent || false, props.direction, props.dispatch)]}
      />
    </RadialMenu>
  </g>
));

function* rotateMenuItems(tile: TileType, permanent: boolean, direction: Direction, dispatch: Dispatch<Action>) {
  if (permanent)
    return;
  if (tile == 'light') {
    yield rotateSelectionMenuItem(dispatch, 'downwards', direction, <IconLight rotate={90} />);
    yield rotateSelectionMenuItem(dispatch, 'leftwards', direction, <IconLight rotate={180} />);
    yield rotateSelectionMenuItem(dispatch, 'upwards', direction, <IconLight rotate={270} />);
    yield rotateSelectionMenuItem(dispatch, 'rightwards', direction, <IconLight rotate={0} />);
  }

  if (tile == 'button') {
    yield rotateSelectionMenuItem(dispatch, 'upwards', direction, <IconButton rotate={270} />);
    yield rotateSelectionMenuItem(dispatch, 'rightwards', direction, <IconButton rotate={0} />);
    yield rotateSelectionMenuItem(dispatch, 'downwards', direction, <IconButton rotate={90} />);
    yield rotateSelectionMenuItem(dispatch, 'leftwards', direction, <IconButton rotate={180} />);
  }
}
