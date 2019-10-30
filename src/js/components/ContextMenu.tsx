import * as React from 'react';
import { Dispatch } from 'redux';
import { TileType } from '../editing';

import RadialMenu from './radialMenu';

import {
  acceptMenuItem,
  removeMenuItem,
  toUnderpassMenuItem,
  toWireMenuItem,
  moveMenuItem,
  floodClearMenuItem,
  rotateMenuItem
} from './radialMenu/menuItems';
import { Action } from '../actions';
import PieRing from './radialMenu/PieRing';
import pure from './pure';
import IconLight from './icons/IconLight';
import IconButton from './icons/IconButton';
import { RADIUS } from './Menu';

export interface Props {
  readonly tileType: TileType;
  readonly dispatch: Dispatch<Action>;
  readonly x: number;
  readonly y: number;
  readonly tx: number;
  readonly ty: number;
}

export default pure<Props>(['x', 'y'], props => (
  <g transform={`translate(${props.x} ${props.y})`}>
    <RadialMenu cx={0} cy={0}>
      <PieRing
        key={0}
        radius={RADIUS}
        width={RADIUS}
        fromTurnFraction={1 / 8}
        toTurnFraction={3 / 8}
        show={true}
        menuItems={[acceptMenuItem(props.dispatch)]}
      />
      <ContextMenuRing
        tileType={props.tileType}
        dispatch={props.dispatch}
        tx={props.tx}
        ty={props.ty}
      />
    </RadialMenu>
  </g>
));

interface ContextMenuRingProps {
  readonly tileType: TileType,
  readonly tx: number,
  readonly ty: number,
  readonly dispatch: Dispatch
}

const ContextMenuRing = pure(['tx', 'ty', 'tileType'], (props: ContextMenuRingProps) => {
  const items = [...tileMenuItems(props.tileType, props.tx, props.ty, props.dispatch)];

  return (
    <PieRing
      key={1}
      radius={RADIUS}
      width={RADIUS}
      fromTurnFraction={(6 - items.length) / 8}
      toTurnFraction={(6 + items.length) / 8}
      show={true}
      menuItems={items}
    />
  );
});

function* tileMenuItems(tile: TileType, tx: number, ty: number, dispatch: Dispatch<Action>) {
  if (tile == 'wire' || tile == 'empty') {
    yield toUnderpassMenuItem(dispatch, tx, ty);
  }

  if (tile == 'underpass' || tile == 'empty') {
    yield toWireMenuItem(dispatch, tx, ty);
  }

  if (tile == 'wire' || tile == 'underpass') {
    yield floodClearMenuItem(dispatch, tx, ty);
  }

  if (tile == 'gate' || tile == 'component') {
    yield moveMenuItem(dispatch, tx, ty);
    yield removeMenuItem(dispatch, tx, ty);
  }

  if (tile == 'light' || tile == 'button') {
    yield moveMenuItem(dispatch, tx, ty);
    yield removeMenuItem(dispatch, tx, ty);
  }
}

function* rotateMenuItems(tile: TileType, tx: number, ty: number, dispatch: Dispatch<Action>) {
  if (tile == 'light') {
    yield rotateMenuItem(dispatch, tx, ty, 'downwards', <IconLight rotate={90} />);
    yield rotateMenuItem(dispatch, tx, ty, 'leftwards', <IconLight rotate={180} />);
    yield rotateMenuItem(dispatch, tx, ty, 'upwards', <IconLight rotate={270} />);
    yield rotateMenuItem(dispatch, tx, ty, 'rightwards', <IconLight rotate={0} />);
  }

  if (tile == 'button') {
    yield rotateMenuItem(dispatch, tx, ty, 'upwards', <IconButton rotate={270} />);
    yield rotateMenuItem(dispatch, tx, ty, 'rightwards', <IconButton rotate={0} />);
    yield rotateMenuItem(dispatch, tx, ty, 'downwards', <IconButton rotate={90} />);
    yield rotateMenuItem(dispatch, tx, ty, 'leftwards', <IconButton rotate={180} />);
  }
}
